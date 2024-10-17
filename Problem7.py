# Time complexity o(n^2)

class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        
        count = 0
        for i in range(len(nums1)):
            if count == m:
                for _ in range(len(nums1)-count):
                    nums1.remove(nums1[i])
            count += 1
        for i in range(len(nums2)):
            if count == m:
                break
            nums1.append(nums2[i])
            count += 1
        
        for i in range(len(nums1)-1):
            for j in range(i+1,len(nums1)):
                if nums1[i] > nums1[j]:
                    nums1[i],nums1[j] = nums1[j],nums1[i]
            
