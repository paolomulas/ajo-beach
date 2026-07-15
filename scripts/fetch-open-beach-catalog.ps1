param(
  [string]$OutputPath = ".artifacts/open-beaches.json"
)

$ErrorActionPreference = "Stop"
$headers = @{ "User-Agent" = "AjoBeachBuildWeek/1.0 (https://github.com/paolomulas/ajo-beach)" }
$endpoints = @(
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter"
)

$latEdges = @(38.68, 39.15, 39.62, 40.09, 40.56, 41.03, 41.42)
$lonEdges = @(7.98, 8.46, 8.94, 9.42, 9.92)
$all = [System.Collections.Generic.List[object]]::new()
$tile = 0

for ($latIndex = 0; $latIndex -lt $latEdges.Count - 1; $latIndex++) {
  for ($lonIndex = 0; $lonIndex -lt $lonEdges.Count - 1; $lonIndex++) {
    $tile++
    $south = $latEdges[$latIndex]
    $north = $latEdges[$latIndex + 1]
    $west = $lonEdges[$lonIndex]
    $east = $lonEdges[$lonIndex + 1]
    $query = "[out:json][timeout:45];nwr[`"natural`"=`"beach`"][`"name`"]($south,$west,$north,$east);out center tags;"
    $result = $null

    for ($attempt = 0; $attempt -lt 4 -and $null -eq $result; $attempt++) {
      $endpoint = $endpoints[($tile + $attempt) % $endpoints.Count]
      try {
        $result = Invoke-RestMethod -Method Post -Uri $endpoint -Headers $headers -Body @{ data = $query } -TimeoutSec 60
      } catch {
        Write-Host "Tile $tile attempt $($attempt + 1) failed: $($_.Exception.Message)"
        Start-Sleep -Seconds (2 + $attempt * 2)
      }
    }

    if ($null -eq $result) { throw "Unable to retrieve tile $tile" }
    foreach ($element in $result.elements) {
      $lat = if ($null -ne $element.lat) { [double]$element.lat } elseif ($null -ne $element.center.lat) { [double]$element.center.lat } else { $null }
      $lon = if ($null -ne $element.lon) { [double]$element.lon } elseif ($null -ne $element.center.lon) { [double]$element.center.lon } else { $null }
      if ($null -eq $lat -or $null -eq $lon) { continue }
      if ($lat -lt 38.68 -or $lat -gt 41.42 -or $lon -lt 7.98 -or $lon -gt 9.92) { continue }
      $name = [string]$element.tags.name
      if ([string]::IsNullOrWhiteSpace($name)) { continue }
      $all.Add([pscustomobject]@{
        osmType = [string]$element.type
        osmId = [long]$element.id
        name = $name.Trim()
        lat = $lat
        lon = $lon
        surface = [string]$element.tags.surface
      })
    }
    Write-Host "Tile $tile complete · raw $($all.Count)"
  }
}

$unique = $all |
  Sort-Object osmType, osmId -Unique |
  Sort-Object name

$directory = Split-Path -Parent $OutputPath
if ($directory -and -not (Test-Path -LiteralPath $directory)) {
  New-Item -ItemType Directory -Path $directory | Out-Null
}
$unique | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $OutputPath -Encoding utf8
Write-Host "OPEN_BEACHES=$($unique.Count)"
