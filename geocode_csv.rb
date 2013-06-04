require 'csv'
require 'fileutils'
require 'geocoder'

Geocoder.configure(:timeout => 5)

csv = CSV.open("app/data/RentalStandardsCurrentIssues.csv")

csv.each do |row|
  full_address = "#{row[0]} #{row[1]}, Vancouver, BC, Canada"

  #print "#{full_address}: "
  begin
    print Geocoder.coordinates(full_address)
    puts
  rescue StandardError => e
    puts "An error occured: #{e}"
  end
end
