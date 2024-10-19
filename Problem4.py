# Missing Number

# Time Complexity o(n^2)

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        length = len(nums)
        for i in range(length+1):
            if not i in nums:
                return i
        return length

# Time Complexity o(n)

class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        length = len(nums)
        expected_num = length * (length + 1) // 2
        actual_sum = sum(nums)
        return expected_num - actual_sum
