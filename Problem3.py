# Contains Duplicate

# Bad example
# o(n^2)

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        for i in range(len(nums) - 1):
            for j in range(i+1,len(nums)):
                if nums[i] == nums[j]:
                    return True
        return False

# Good Example
# Using set
# o(n)

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        st = set()
        for i in nums:
            if i in st:
                return True
            st.add(i)
        return False

# Good Example
# Using dict
# o(n)

class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        di = dict()
        for i in nums:
            if i in di:
                return True
            di[i] = 0
        return False
