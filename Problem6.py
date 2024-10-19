# Time complexity o(n^2)

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """
        for i in range(len(nums)-1):
            for j in range(i+1,len(nums)):
                if nums[i] > nums[j]:
                    nums[i] , nums[j] = nums[j],nums[i]


# Time complexity o(n)

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        Do not return anything, modify nums in-place instead.
        """

        low,mid,high = 0,0,len(nums)-1

        while mid <= high:
            if nums[mid] == 0:
                nums[mid],nums[low] = nums[low],nums[mid]
                mid += 1
                low += 1
                
            elif nums[mid] == 1:
                mid += 1

            else:
                nums[mid],nums[high] = nums[high],nums[mid]
                high -= 1
