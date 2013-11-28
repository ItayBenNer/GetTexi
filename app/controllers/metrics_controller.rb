class MetricsController < ApplicationController
  before_action :set_metric, only: [:show, :edit, :update, :destroy]



  # GET /metrics
  # GET /metrics.json
  def index
    @metrics = Metric.all
  end

  # GET /search.json
  # pereform search on Metrics and return list of the appling query Metrics
  # prams: 
  # => name:string 
  def search

    @locations = [];
    name = params[:name];
    if name.length > 0
      #preform search only for querys more then 1 char
      @locations = Metric.where(n:name)
    end

    #return as json
   respond_to do |format|
     format.json  { render :json => @locations }
   end
  end

  # GET /metrics/1
  # GET /metrics/1.json
  def show
  end

  # GET /metrics/new
  def new
    @metric = Metric.new
  end

  # GET /metrics/1/edit
  def edit
  end


  # POST /metrics
  # POST /metrics.json
  def create
    @metric = Metric.new(metric_params)

    respond_to do |format|
      if @metric.save
        format.html { redirect_to @metric, notice: 'Metric was successfully created.' }
        format.json { render action: 'show', status: :created, location: @metric }
      else
        format.html { render action: 'new' }
        format.json { render json: @metric.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /metrics/1
  # PATCH/PUT /metrics/1.json
  def update
    respond_to do |format|
      if @metric.update(metric_params)
        format.html { redirect_to @metric, notice: 'Metric was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @metric.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /metrics/1
  # DELETE /metrics/1.json
  def destroy
    @metric.destroy
    respond_to do |format|
      format.html { redirect_to metrics_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_metric
      @metric = Metric.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def metric_params
      params.require(:metric).permit(:n, :v, :t, :lat, :lon, :ts, :driver_id)
    end
end
