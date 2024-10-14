# isPalindrome
# Time complexity o(n)

class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0 or (x % 10 == 0 and x != 0):
            return False

        real_number = x
        reversed = 0
        while x > 0:
            reversed = reversed * 10 + x % 10
            x //= 10
        
        return real_number == reversed
