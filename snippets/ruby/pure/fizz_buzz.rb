module FizzBuzz
  class Normal
    def self.run(max_iteration = 100)
      (1..max_iteration).each do |index|
        if index % 15 == 0
          puts "FizzBuzz"
        elsif index % 3 == 0
          puts "Fizz"
        elsif index % 5 == 0
          puts "Buzz"
        else
          puts index
        end
      end
    end
  end

  class Refactored
    def self.run(max_iteration = 100)
      (1..max_iteration).each do |index|
        puts self.handle(index)
      end
    end

    def self.multi_of_three?(number) = number % 3 == 0
    def self.multi_of_five?(number) = number % 5 == 0
    def self.multi_of_fifteen?(number) = number % 15 == 0

    def self.handle(number)
      case
      when multi_of_fifteen?(number) then "FizzBuzz"
      when multi_of_three?(number) then "Fizz"
      when multi_of_five?(number) then "Buzz"
      else number
      end
    end
  end

  class Shorten
    def self.run(m = 100)
      (1..m).each { |n| puts n % 15 == 0 ? "FizzBuzz" : n % 3 == 0 ? "Fizz" : n % 5 == 0 ? "Buzz" : n }
    end
  end
end
