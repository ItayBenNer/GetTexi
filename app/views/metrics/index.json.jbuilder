json.array!(@metrics) do |metric|
  json.extract! metric, :n, :v, :t, :lat, :lon, :ts, :driver_id
  json.url metric_url(metric, format: :json)
end