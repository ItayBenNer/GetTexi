class Metric < ActiveRecord::Base




scope :name_like, (lambda do |str|
                              {:conditions => ['lower(n) like ?', "%{str.downcase}%"]}
                            end )
end
