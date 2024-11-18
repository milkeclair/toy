module SimpleAsync
  def async(&block)
    Thread.new { block.call }
  end

  def await(task: nil, &block)
    if task
      task.value
    else
      async(&block).value
    end
  end
end
