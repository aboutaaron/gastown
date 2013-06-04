require 'csv'
require 'fileutils'
require 'geocoder'

Geocoder.configure(
  :timeout => 5
)

csv = CSV.open("app/data/RentalStandardsCurrentIssues.csv", :headers => :first_row, "w+")

csv.each do |row|
  full_address = "#{row[0]} #{row[1]}, Vancouver, BC, Canada"

  csv << Geocoder.coordinates(full_address)
end
