# Best Time to buy and sell

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        maxprofit = 0
        buy = prices[0]
        for i in range(len(prices)):
            if prices[i] - buy < 0:
                buy = prices[i]
                continue
            if prices[i] - buy > maxprofit:
                maxprofit = prices[i] - buy
        return maxprofit
    
