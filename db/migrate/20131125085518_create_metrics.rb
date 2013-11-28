class CreateMetrics < ActiveRecord::Migration
  def change
    create_table :metrics do |t|
      t.string :n
      t.string :v
      t.string :t
      t.float :lat
      t.float :lon
      t.timestamp :ts
      t.integer :driver_id

      t.timestamps
    end
  end
end
