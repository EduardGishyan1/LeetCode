#TwoSum

# Bad solution
# time complexity o(n^2)

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for i in range(len(nums)-1):
            for j in range(i+1,len(nums)):
                if nums[i] + nums[j] == target:
                    return [i,j]

# Good solution

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        di = {}
        for i in range(len(nums)):
            num = nums[i]
            m = target - num
            if m in di:
                return [di[m],i]
            di[num] = i

        return []
