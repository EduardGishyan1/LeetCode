# Missing Number

# Time Complexity o(n^2)

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        length = len(nums)
        for i in range(length+1):
            if not i in nums:
                return i
        return length
