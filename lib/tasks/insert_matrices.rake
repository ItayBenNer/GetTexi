require 'json'
require 'active_record'
#@TODO add banchmark 

namespace :metrics do

	desc "Clear all records in metrics table"
	task :clearall => :environment  do
		Metric.delete_all
	end

	desc "import bulk items from metrics log file
	read all the json data and insert to db
	params: 
		@path:string => path to the log file"
	task :import, [:path] => :environment do |t,args|
		#handle args
		args.with_defaults(:path => nil)  
		args.each do |k,v|
			if v == nil
				fail 'there is one or more nil args.'
			end
		end
		#retrive all the rows from the log file
		rows = readfile(args[:path])
		if rows != nil 
			puts('start import bulk of '+rows.length+' matrics to db...');
			newMetrics = []
			puts('start parse metrics data from:' + args[:path]);
			rows.each do | row |
				metricData = JSON.parse(row)
				#fix for datetime format (windows environment)
				#in case for 'LINUX' this line needs to be removed
				metricData['ts'] = Time.at(metricData['ts']).to_datetime
				newMetrics.push(Metric.new(metricData))

				#upsert_single_metric(metricData)
			end
			puts('finish parse');
			#import bulk of data
			Metric.import newMetrics, :validate => false
			puts('finish import');
		else
			puts('file has no data')
		end
	end

	#help functions

	#read file and return array of rows
	# params: @file_path:String
	def readfile(file_path)

		if File.exists?(file_path)
			File.readlines(file_path)
		else
			puts('err: file not found')
		end
	end

	#insert metrics to db by first ceck if already exists in db
	#in case item already exists do update insted of insert
	# params: @data:Array of Metrics
	def upsert_single_metric(data)

		if data != nil

			#check if item already exists
			matric = Metric.where(data).first
			
			#print object
			puts matric.to_yaml
			if matric == nil
				#insert
				Metric.create(data)
			else
				#update
				matric.update_attributes(data)
			end
		else
			puts('no data to insert')
		end
	end


end

