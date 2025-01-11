class Timer
  def initialize
    @start_time, @end_time = nil
  end

  def self.measure(&block)
    timer = new
    timer.start
    result = block.call
    timer.stop
    { result: result, elapsed: timer.elapsed }
  end

  def start
    raise "Timer already started" if @start_time
    @start_time = gettime
  end

  def current
    raise "Timer not started" unless @start_time
    gettime - @start_time
  end

  def stop
    raise "Timer not started" unless @start_time
    @end_time = gettime
  end

  def elapsed
    @end_time ? (@end_time - @start_time) : current
  end

  def reset
    @start_time, @end_time = nil
  end

  private def gettime
    Process.clock_gettime(Process::CLOCK_MONOTONIC)
  end
end
