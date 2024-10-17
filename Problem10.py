class Solution:
 def isValid(self,s: str) -> bool:
    brackets = {")":"(","}":"{","]":"["}
    ls = []
    if len(s) == 1:
        return False
    for char in s:
        if char in brackets.values():
            ls.append(char)
        elif char in brackets.keys():
            if not ls or ls[-1] != brackets[char]:
                return False
            ls.pop()
   
    return not ls
