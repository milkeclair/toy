module MultiByteLjust
  class ::String
    include MultiByteLjust
  end

  def multi_byte_ljust(width, padding = " ", truncate: false, ellipsis: true)
    select_bytesize = ->(c) { c.bytesize == 1 ? 1 : 2 }
    self_width = each_char.map(&select_bytesize).sum
    is_over = self_width >= width

    return self if is_over && !truncate
    return self[0, (width - 1)] + "…" if is_over && ellipsis
    return self[0, width] if is_over

    padding_count = [0, width - self_width].max

    self + (padding * padding_count)
  end

  alias_method :mb_ljust, :multi_byte_ljust
end
