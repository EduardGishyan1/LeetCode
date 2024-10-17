# Time complexity o(n)

class Solution:
  def myAtoi(self,s: str) -> int:
        max_num = 2**31 - 1
        min_num = -2**31
        s = s.strip()
        index = 0

        if s == '':
            return 0

        if s[0] == '-':
            sign = -1
            index = 1

        elif s[0] == "+":
            sign = 1
            index = 1
        else:
            sign = 1
        
        
        result = 0
        while index < len(s) and s[index].isdigit():
            result = result * 10 + (ord(s[index]) - ord("0"))
            index += 1
        
        if sign == 1 and result > max_num:
            return max_num
        if sign == -1 and result * sign < min_num:
            return min_num
        
        return sign * result
