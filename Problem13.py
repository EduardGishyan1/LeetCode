class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        if not target in nums and target > nums[-1]:
            return len(nums)
            
        for i in range(len(nums)):
            if nums[i] < target:
                continue
            return i
