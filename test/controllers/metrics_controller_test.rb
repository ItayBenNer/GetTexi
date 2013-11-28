require 'test_helper'

class MetricsControllerTest < ActionController::TestCase
  setup do
    @metric = metrics(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:metrics)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create metric" do
    assert_difference('Metric.count') do
      post :create, metric: { driver_id: @metric.driver_id, lat: @metric.lat, lon: @metric.lon, n: @metric.n, t: @metric.t, ts: @metric.ts, v: @metric.v }
    end

    assert_redirected_to metric_path(assigns(:metric))
  end

  test "should show metric" do
    get :show, id: @metric
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @metric
    assert_response :success
  end

  test "should update metric" do
    patch :update, id: @metric, metric: { driver_id: @metric.driver_id, lat: @metric.lat, lon: @metric.lon, n: @metric.n, t: @metric.t, ts: @metric.ts, v: @metric.v }
    assert_redirected_to metric_path(assigns(:metric))
  end

  test "should destroy metric" do
    assert_difference('Metric.count', -1) do
      delete :destroy, id: @metric
    end

    assert_redirected_to metrics_path
  end
end
