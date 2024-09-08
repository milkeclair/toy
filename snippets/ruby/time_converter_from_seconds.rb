# どうやってdivisorsやsecondsを参照できるのか？
# 1. time_converter_from_secondsが呼ばれると、secondsに渡した数値が代入される
# 2. time_converter_from_secondsはメソッドを返す
# 3. そのメソッドは定義された時のスコープを覚えている(クロージャ)ため、secondsやdivisorsを参照(キャプチャ)できる
# time_converter_from_secondsが参照されなくなると、secondsやdivisorsはガベージコレクションされ、参照出来なくなる
# クロージャは変数を記憶する仕組みなので、適宜解放しないとメモリリークの原因になる(ゴミが溜まる)
time_converter_from_seconds = lambda do |seconds|
  seconds = seconds.to_i

  divisors = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
  }

  lambda do |unit|
    raise ArgumentError, "Invalid unit: #{unit}" unless divisors.key?(unit)
    seconds.div(divisors[unit])
  end
end

# 例: 1年(31_536_000秒)
time_converter = time_converter_from_seconds.call(31_536_000)
p time_converter.call(:year) # => 1
p time_converter.call(:month) # => 12
p time_converter.call(:day) # => 365
p time_converter.call(:hour) # => 8760
p time_converter.call(:minute) # => 525600
# p time_converter.call(:second) # => ArgumentError: Invalid unit: second
