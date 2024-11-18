module Debounce
  def debounce(delay, &block)
    @debounce_thread&.kill
    @debounce_thread = Thread.new do
      sleep delay
      block.call
    end
  end
end
