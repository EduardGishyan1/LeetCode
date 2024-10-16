from typing import List

def insertion_sort(nums: List[int]) -> None:
    for i in range(len(nums)):
        key = nums[i]
        j = i - 1
        while j >= 0 and key < nums[j]:
            nums[j] , nums[j+1] = nums[j+1],nums[j]
            j -= 1
        nums[j+1] = key

class Students:
    def __init__(self,age,grade):
        self.age = age
        self.grade = grade
    
    @property
    def age(self):
        return self.__age
    
    @age.setter
    def age(self,value):
        self.__age = value
        
    @property
    def grade(self):
        return self.__grade
    
    @grade.setter
    def grade(self,value):
        self.__grade = value
        
    def __repr__(self):
        return f"age is: {self.age} ,grade is: {self.grade}"
    
    def __gt__(self,other:"Students"):
        return self.age > other.age
        
# import random

# students_list = [Students(random.randint(16,50),random.randint(1,100)) for _ in range(20)]
# insertion_sort(students_list)
# print(students_list)