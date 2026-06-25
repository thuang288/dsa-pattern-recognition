import { useState, useEffect } from "react";

const patterns = [
  {
    name: "Two Pointers",
    color: "#4ECDC4",
    keywords: ["pair", "triplet", "sorted array", "two sum", "palindrome", "remove duplicates", "closest sum", "container with water", "target sum", "fast slow pointer", "sort colors", "partition", "3 categories", "in-place sort"],
    tells: [
      "Input is sorted (or can be sorted)",
      "Need to find a pair or triplet that meets a condition",
      "Need to compare from both ends",
      "Removing/squeezing duplicates in place"
    ],
    example: "Two Sum II, 3Sum, Valid Palindrome, Container With Most Water",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Sort the array if not already sorted (required for two pointers to work)",
      "Place one pointer at the start (left = 0) and one at the end (right = len-1)",
      "Compute the current result using both pointer values",
      "If result matches target → record answer",
      "If result is too small → move left pointer right (need bigger value)",
      "If result is too big → move right pointer left (need smaller value)",
      "Repeat until pointers meet",
      "For 3Sum: fix one element with a loop, then run two pointers on the rest"
    ],
    templates: [
      {
        label: "Opposite Ends (find a pair)",
        hint: "sorted array + find a pair/triplet that sums to target, or 'two numbers that...'",
        code: `left, right = 0, len(arr) - 1
# start at opposite ends, squeeze inward

while left < right:
    total = arr[left] + arr[right]
    if total == target:
        return [left, right]
    elif total < target:
        left += 1   # sum too small, move left up to get bigger value
    else:
        right -= 1  # sum too big, move right down to get smaller value`
      },
      {
        label: "Remove Duplicates In-Place",
        hint: "'remove duplicates in-place', 'return length of unique elements', input is sorted",
        code: `k = 1  # k = next position to write a unique value into
# start at 1 because first element is always unique

for i in range(1, len(nums)):
    if nums[i] != nums[i - 1]:  # found a new unique value
        nums[k] = nums[i]  # write it into the next available slot
        # (overwrites the duplicate sitting there)
        k += 1  # advance the write pointer

return k  # k = count of unique elements`
      },
      {
        label: "Three Pointers (3Sum)",
        hint: "'find all triplets', '3 numbers that sum to 0', need all unique combinations of 3 elements",
        code: `nums.sort()  # must sort so two-pointer logic works
result = []

for i in range(len(nums) - 2):
    if i > 0 and nums[i] == nums[i-1]: continue  # skip duplicate anchor values

    left, right = i + 1, len(nums) - 1  # two pointers scan the rest
    while left < right:
        total = nums[i] + nums[left] + nums[right]
        if total == 0:
            result.append([nums[i], nums[left], nums[right]])
        if total <= 0:
            left += 1   # need a bigger number
        else:
            right -= 1  # need a smaller number

return result`
      },
      {
        label: "3-Way Partition (Dutch National Flag)",
        hint: "'sort colors', 'exactly 3 categories in-place', 'partition into 3 groups' — 3 pointers maintain left/mid/right boundaries",
        code: `# Dutch National Flag: partition array into 3 groups in O(n) time O(1) space
# Works for: Sort Colors (0,1,2), any problem with exactly 3 distinct values

l, r = 0, len(nums) - 1  # l = right boundary of 0s, r = left boundary of 2s
i = 0                     # i = current element being examined

# Regions maintained at all times:
# [0..l-1]  = all 0s  (sorted)
# [l..i-1]  = all 1s  (processed, in place)
# [i..r]    = unknown (not yet processed)
# [r+1..n]  = all 2s  (sorted)

while i <= r:
    if nums[i] == 0:
        nums[l], nums[i] = nums[i], nums[l]
        l += 1
        i += 1  # safe to advance: element from left boundary is always a 1
    elif nums[i] == 2:
        nums[i], nums[r] = nums[r], nums[i]
        r -= 1
        # do NOT advance i: swapped element from right is unknown, must re-examine
    else:  # nums[i] == 1 — already in correct region
        i += 1`
      }
    ],
    confusables: [
      {
        other: "Binary Search",
        similarity: "Both work on sorted arrays",
        difference: "Two Pointers compares elements against each other (find a pair). Binary Search looks for a specific target value by cutting the search space in half.",
        rule: "Finding a pair that meets a condition → Two Pointers. Finding where a specific value is → Binary Search."
      },
      {
        other: "Sliding Window",
        similarity: "Both use two indices moving through an array",
        difference: "Sliding Window's pointers always move the same direction (both go →). Two Pointers start at opposite ends and move toward each other.",
        rule: "Pointers start on opposite ends → Two Pointers. Pointers start on the same side and expand/shrink → Sliding Window."
      }
    ]
  },
  {
    name: "Sliding Window",
    color: "#FF6B6B",
    keywords: ["subarray", "substring", "contiguous", "longest", "shortest", "maximum sum", "k elements", "window"],
    tells: [
      "Contiguous subarray or substring",
      "Find longest/shortest that satisfies a condition",
      "Fixed or variable size window",
      "Running sum/count within a range"
    ],
    example: "Longest Substring Without Repeating, Max Sum Subarray of Size K",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Initialize left = 0, and a variable to track the window state (sum, count, hashmap)",
      "Expand the window by moving right pointer forward one step at a time",
      "Update the window state by adding the new right element",
      "Check if the window violates the condition (too large, invalid char count, etc.)",
      "While window is invalid: shrink from the left (remove left element, left++)",
      "After shrinking, the window is valid — update your answer (max length, min length, etc.)",
      "For fixed size k: slide by adding right element and removing the element at right-k"
    ],
    templates: [
      {
        label: "Variable Size Window",
        hint: "'longest/shortest subarray/substring that...', condition can be maintained by shrinking from left",
        code: `left = 0
for right in range(len(arr)):
    window.add(arr[right])      # grow window by including right element

    while window_is_invalid:    # window broke the condition — shrink from left
        window.remove(arr[left])
        left += 1               # move left pointer up until window is valid again

    # at this point window is valid — update answer
    result = max(result, right - left + 1)`
      },
      {
        label: "Fixed Size Window (size k)",
        hint: "'subarray of size k', 'exactly k elements', window size is given and never changes",
        code: `window_sum = sum(arr[:k])  # initialize first window of size k
result = window_sum

for i in range(k, len(arr)):
    # slide: add new right element, remove leftmost element
    window_sum += arr[i] - arr[i - k]
    # arr[i - k] is the element that just fell out of the left side
    result = max(result, window_sum)`
      },
      {
        label: "Substring with Frequency Count",
        hint: "'longest substring with at most k distinct chars', 'minimum window substring', need to track character counts inside window",
        code: `from collections import defaultdict
count = defaultdict(int)  # tracks frequency of chars in current window
left = 0

for right in range(len(s)):
    count[s[right]] += 1  # add right char to window

    while window_invalid(count):  # too many of a char, or other violation
        count[s[left]] -= 1
        if count[s[left]] == 0:
            del count[s[left]]  # clean up so we don't track zero-count chars
        left += 1  # shrink window from left

    result = max(result, right - left + 1)`
      }
    ],
    confusables: [
      {
        other: "Two Pointers",
        similarity: "Both use two indices on an array",
        difference: "Sliding Window maintains a contiguous range where both pointers move the same direction. Two Pointers compares elements from opposite ends.",
        rule: "Need a contiguous subarray or substring → Sliding Window. Need a pair that satisfies a sum/condition → Two Pointers."
      },
      {
        other: "Dynamic Programming",
        similarity: "Both can answer 'longest/shortest subarray' type questions",
        difference: "Sliding Window works when the condition is simple (sum, count of unique chars). DP is needed when the answer at each position depends on multiple prior positions in a complex way.",
        rule: "Can you shrink/expand a window to maintain the condition? → Sliding Window. Does each position depend on many previous positions in a non-trivial way? → DP."
      }
    ]
  },
  {
    name: "Binary Search",
    color: "#45B7D1",
    keywords: ["sorted", "find position", "search", "minimum/maximum possible", "feasible", "rotated array", "log n", "minimize maximum", "first occurrence", "last occurrence", "kth element"],
    tells: [
      "Array is sorted (or rotated sorted)",
      "Find if something exists or its index",
      "'Is it possible to achieve X' with a numeric range",
      "Problem asks for O(log n)"
    ],
    example: "Search in Rotated Array, Koko Eating Bananas, Find Peak Element",
    constraint: { label: "n ≥ 10^7 · O(log n)", color: "#FC5C65" },
    approach: [
      "Identify the search space: is it an array index range, or a value range (answer space)?",
      "Set lo and hi to the boundaries of the search space",
      "Compute mid = lo + (hi - lo) // 2 (avoid overflow)",
      "Check if mid is the answer, too small, or too big",
      "Eliminate half: if too small → lo = mid + 1, if too big → hi = mid - 1",
      "For answer space problems: define a feasibility function, binary search on the answer",
      "For rotated arrays: first determine which half is sorted, then check if target is in it",
      "Return lo (or hi) when lo > hi — lo is the insertion point or minimum feasible answer"
    ],
    templates: [
      {
        label: "Standard (find target)",
        hint: "sorted array + 'find index of', 'search for', 'does X exist' — one specific value to locate",
        code: `lo, hi = 0, len(arr) - 1

while lo <= hi:
    mid = (lo + hi) // 2  # always integer division to get middle index
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        lo = mid + 1  # target is in right half, discard left
    else:
        hi = mid - 1  # target is in left half, discard right

return -1  # target not found`
      },
      {
        label: "On Answer Space (feasibility)",
        hint: "'minimum speed/days/capacity to...', 'maximum minimum', 'is it possible to achieve X' — answer is a number in a range",
        code: `# Use when you're searching for the minimum/maximum VALUE that satisfies a condition
# e.g. "minimum speed", "minimum capacity", "minimum days"
lo, hi = min(arr), max(arr)  # search space is the range of possible answers

while lo < hi:
    mid = (lo + hi) // 2
    if is_feasible(mid):
        hi = mid       # mid works — try something smaller (find minimum)
    else:
        lo = mid + 1   # mid doesn't work — need bigger

return lo  # lo == hi == the smallest feasible answer`
      },
      {
        label: "Rotated Sorted Array",
        hint: "array was originally sorted but then rotated at some pivot — 'search in rotated sorted array'",
        code: `lo, hi = 0, len(arr) - 1

while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target: return mid

    if arr[lo] <= arr[mid]:           # left half is cleanly sorted
        if arr[lo] <= target < arr[mid]:
            hi = mid - 1             # target is in sorted left half
        else:
            lo = mid + 1             # target must be in right half
    else:                             # right half is cleanly sorted
        if arr[mid] < target <= arr[hi]:
            lo = mid + 1             # target is in sorted right half
        else:
            hi = mid - 1             # target must be in left half

return -1`
      }
    ],
    confusables: [
      {
        other: "Two Pointers",
        similarity: "Both require a sorted array",
        difference: "Binary Search cuts the search space in half to find a target — you jump to the middle. Two Pointers walks inward from both ends to find a pair.",
        rule: "Searching for one specific value → Binary Search. Matching two values together to meet a condition → Two Pointers."
      },
      {
        other: "BFS (Graph/Matrix)",
        similarity: "Both can find a minimum value or shortest path",
        difference: "Binary Search works on a sorted 1D range where you can mathematically eliminate half. BFS works on graphs/grids where you have to explore neighbors step by step.",
        rule: "Input is a sorted array or numeric range → Binary Search. Input is a grid or graph → BFS."
      }
    ]
  },
  {
    name: "Monotonic Stack",
    color: "#20bf6b",
    keywords: ["next greater element", "next smaller", "previous greater", "daily temperatures", "largest rectangle", "span"],
    tells: [
      "For each element, find the next/previous greater or smaller",
      "Stack stays sorted (increasing or decreasing)",
      "Involves looking left or right for a boundary"
    ],
    example: "Daily Temperatures, Next Greater Element, Largest Rectangle in Histogram",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Initialize an empty stack (stores indices, not values)",
      "Iterate through the array left to right",
      "While the stack is not empty AND the current element satisfies the condition (e.g. greater than stack top): pop from stack — current element is the answer for the popped index",
      "Record the answer for the popped index (e.g. distance = i - popped_index, or value = current element)",
      "Push the current index onto the stack",
      "After the loop: any indices still in the stack have no next greater/smaller element (answer = -1 or 0)",
      "For decreasing monotonic stack: pop when current < stack top instead"
    ],
    templates: [
      {
        label: "Next Greater Element",
        hint: "'next greater element', 'next warmer temperature', 'next larger value to the right' — need the first bigger value for each element",
        code: `stack = []          # stores indices of elements waiting for their next greater
result = [-1] * len(arr)  # default -1 if no greater element exists

for i, val in enumerate(arr):
    # pop everything smaller than current val — current val is their next greater
    while stack and arr[stack[-1]] < val:
        idx = stack.pop()
        result[idx] = val   # val is the answer for the element at idx
    stack.append(i)         # push current index — still waiting for its next greater

return result`
      },
      {
        label: "Daily Temperatures (distance to next greater)",
        hint: "'daily temperatures', 'how many days until warmer', 'distance to next greater' — same as next greater but you need the gap/distance, not the value",
        code: `stack = []          # stores indices, waiting for a warmer day
result = [0] * len(temps)  # 0 = no warmer day found

for i, temp in enumerate(temps):
    # today is warmer than days still in stack — answer those days
    while stack and temps[stack[-1]] < temp:
        idx = stack.pop()
        result[idx] = i - idx   # distance = today's index minus that day's index
    stack.append(i)

return result`
      },
      {
        label: "Largest Rectangle in Histogram",
        hint: "'largest rectangle in histogram', 'maximal rectangle in matrix' — for each bar, find how far left and right it can extend while staying the shortest",
        code: `stack = []    # stores indices, heights in increasing order
max_area = 0
arr = heights + [0]  # append 0 as sentinel to force all remaining bars to be popped

for i, h in enumerate(arr):
    # current bar is shorter — pop taller bars and compute their max rectangle
    while stack and arr[stack[-1]] > h:
        height = arr[stack.pop()]
        # width: from current position back to the next shorter bar in stack
        width = i if not stack else i - stack[-1] - 1
        max_area = max(max_area, height * width)
    stack.append(i)

return max_area`
      }
    ],
    confusables: [
      {
        other: "Two Pointers",
        similarity: "Both can solve 'container with water' type problems",
        difference: "Monotonic Stack is for finding the next/previous boundary for every element in one pass. Two Pointers compares two specific elements from opposite ends.",
        rule: "Need the next/previous greater or smaller for EACH element → Monotonic Stack. Comparing two elements against each other from both ends → Two Pointers."
      },
      {
        other: "Binary Search",
        similarity: "Both can find boundaries efficiently",
        difference: "Binary search finds a boundary in a sorted array for one query in O(log n). Monotonic Stack finds the next/previous greater or smaller for every element in O(n) total.",
        rule: "Array is sorted and you need one boundary → Binary Search. Need the answer for every element regardless of sort order → Monotonic Stack."
      }
    ]
  },
  {
    name: "HashMap",
    color: "#00b894",
    keywords: ["count frequency", "find duplicates", "anagram", "two sum", "group by", "cache", "seen before", "first occurrence", "complement"],
    tells: [
      "Need to look up whether something was seen before",
      "Counting occurrences of elements",
      "Grouping elements by a key",
      "Finding a complement or pair in O(1)"
    ],
    example: "Two Sum, Valid Anagram, Group Anagrams, Longest Consecutive Sequence",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Decide what to store in the map: value→index (Two Sum), value→frequency (anagram), key→group (group anagrams)",
      "For complement lookup (Two Sum): for each element, check if its complement already exists in the map, then add current element to map",
      "For frequency counting: use Counter or defaultdict, then compare or query the counts",
      "For grouping: derive a key (sorted string, frequency tuple), append each element to its group",
      "For existence checks (consecutive sequence): first build a set, then only start counting from sequence beginnings (num-1 not in set)"
    ],
    templates: [
      {
        label: "Complement Lookup (Two Sum)",
        hint: "'two sum', 'find pair that sums to target', 'two numbers that add to X' — store complement, check if current number was seen",
        code: `seen = {}  # maps value → index

for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]  # found the pair
    seen[num] = i  # store current number for future lookups
    # we store AFTER checking so a number can't pair with itself`
      },
      {
        label: "Frequency Count",
        hint: "'count frequency', 'find duplicates', 'most common element', 'valid anagram' — count occurrences then check/compare",
        code: `from collections import Counter

count = Counter(nums)  # {value: frequency}

# Check anagram: two strings are anagrams if their counts match
return Counter(s) == Counter(t)

# Find duplicates: any frequency > 1
return any(v > 1 for v in count.values())

# Most frequent: max by value
return max(count, key=count.get)`
      },
      {
        label: "Group By Key (Group Anagrams)",
        hint: "'group anagrams', 'group by property', 'bucket by characteristic' — use a derived key to group related elements together",
        code: `from collections import defaultdict

groups = defaultdict(list)

for word in strs:
    key = tuple(sorted(word))  # anagrams share the same sorted key
    # could also use tuple(Counter(word).items()) or a frequency tuple
    groups[key].append(word)

return list(groups.values())`
      },
      {
        label: "Longest Consecutive Sequence",
        hint: "'longest consecutive sequence', 'consecutive elements' — use set for O(1) lookup, only start counting from sequence beginnings",
        code: `num_set = set(nums)  # O(1) lookup
best = 0

for num in num_set:
    if num - 1 not in num_set:  # only start from the beginning of a sequence
        # if num-1 exists, we'd be counting the same sequence from a later start
        length = 1
        while num + length in num_set:
            length += 1
        best = max(best, length)

return best`
      }
    ],
    confusables: [
      {
        other: "Two Pointers",
        similarity: "Both can solve Two Sum type problems",
        difference: "HashMap solves Two Sum on an unsorted array in O(n) time. Two Pointers solves it on a sorted array in O(n) time with O(1) space.",
        rule: "Array is unsorted and you can't sort it → HashMap. Array is already sorted → Two Pointers."
      },
      {
        other: "Sliding Window",
        similarity: "Both can track character/element counts in a window",
        difference: "Sliding Window uses a HashMap internally to track window contents, but the pattern is about the expanding/shrinking window logic. HashMap alone is just the lookup structure.",
        rule: "Need to track a contiguous window of elements → Sliding Window (uses HashMap inside). Just need to look things up or count globally → HashMap."
      }
    ]
  },
  {
    name: "Top K Elements / Heap",
    color: "#A55EEA",
    keywords: ["top k", "kth largest", "kth smallest", "most frequent", "k closest", "k pairs"],
    tells: [
      "Find the k largest or smallest elements",
      "Most/least frequent k elements",
      "Don't need everything sorted, just top/bottom k"
    ],
    example: "Kth Largest Element, Top K Frequent Elements, K Closest Points",
    constraint: { label: "n ≤ 10^6 · O(n log k)", color: "#f9ca24" },
    approach: [
      "Identify the comparison key: value, frequency, distance, or custom metric",
      "Initialize a min-heap of size k (use max-heap for k smallest by negating values)",
      "For each element, push it onto the heap",
      "If heap size exceeds k, pop the smallest element (maintains only top k)",
      "After processing all elements, heap contains exactly the top k",
      "For Top K Frequent: first count frequencies with Counter, then heap on (freq, element)",
      "For K Closest Points: heap on negative distance so farthest gets popped first"
    ],
    templates: [
      {
        label: "Kth Largest (min-heap of size k)",
        hint: "'kth largest element', 'find the kth biggest' — single element, not a list",
        code: `import heapq
heap = []  # min-heap — the smallest element in heap is always at top

for num in nums:
    heapq.heappush(heap, num)
    if len(heap) > k:
        heapq.heappop(heap)  # evict the smallest — only keep top k
        # after this, heap contains exactly the k largest seen so far

return heap[0]  # top of min-heap = smallest of top k = kth largest`
      },
      {
        label: "Top K Frequent Elements",
        hint: "'top k most frequent', 'k most common elements' — frequency-based ranking",
        code: `from collections import Counter
import heapq

count = Counter(nums)  # count frequency of each element

heap = []
for num, freq in count.items():
    heapq.heappush(heap, (freq, num))  # heap sorted by frequency
    if len(heap) > k:
        heapq.heappop(heap)  # remove least frequent — keep only top k frequent

return [num for freq, num in heap]`
      },
      {
        label: "K Closest Points (custom key)",
        hint: "'k closest points to origin', 'k nearest' based on distance or a custom comparison — not frequency",
        code: `import heapq

heap = []
for x, y in points:
    dist = -(x*x + y*y)  # negate distance so max-heap behavior via min-heap
    heapq.heappush(heap, (dist, x, y))
    if len(heap) > k:
        heapq.heappop(heap)  # removes the farthest point (most negative = largest dist)
        # only the k closest remain in the heap

return [[x, y] for _, x, y in heap]`
      }
    ],
    confusables: [
      {
        other: "Two Heaps",
        similarity: "Both use heaps",
        difference: "Top K keeps one heap of size k to track the best k elements. Two Heaps keeps two heaps to track the median.",
        rule: "Need the median continuously → Two Heaps. Need the top/bottom k elements → Single Heap."
      },
      {
        other: "Binary Search",
        similarity: "Both can find the kth smallest/largest",
        difference: "Heap approach is simpler to implement and O(n log k). Binary search on this (QuickSelect) is O(n) average but much harder to code correctly under pressure.",
        rule: "Default to Heap in interviews. Only switch to QuickSelect if they explicitly ask for O(n) time complexity."
      }
    ]
  },
  {
    name: "Two Heaps",
    color: "#F7B731",
    keywords: ["median", "stream", "data stream", "running median", "kth largest/smallest continuously"],
    tells: [
      "Need the median of a stream of numbers",
      "Need to balance two halves of data",
      "Continuously finding median as data comes in"
    ],
    example: "Find Median From Data Stream, Sliding Window Median",
    constraint: { label: "n ≤ 10^6 · O(n log n)", color: "#f9ca24" },
    approach: [
      "Create two heaps: max_heap for the lower half (store negated values), min_heap for the upper half",
      "For each new number: push to max_heap first (always)",
      "Balance ordering: pop max of max_heap and push to min_heap (ensures lower half ≤ upper half)",
      "Balance sizes: if min_heap is larger, pop its min and push back to max_heap",
      "Invariant: max_heap size = min_heap size OR max_heap size = min_heap size + 1",
      "To find median: if sizes equal → average of both tops. If max_heap is larger → top of max_heap",
      "For sliding window: also mark elements leaving the window for lazy deletion"
    ],
    templates: [
      {
        label: "Median From Data Stream",
        hint: "'data stream', 'addNum then findMedian', need median after each insertion",
        code: `import heapq
max_heap = []  # lower half — we store negatives because Python only has min-heap
min_heap = []  # upper half — stores positives normally

def addNum(num):
    heapq.heappush(max_heap, -num)  # push to lower half (negated)

    # enforce ordering: every value in lower half <= every value in upper half
    # move the largest of lower half to upper half
    heapq.heappush(min_heap, -heapq.heappop(max_heap))

    # rebalance sizes: max_heap can have at most 1 extra element
    if len(min_heap) > len(max_heap):
        heapq.heappush(max_heap, -heapq.heappop(min_heap))

def findMedian():
    if len(max_heap) > len(min_heap):
        return -max_heap[0]         # odd total — middle is top of lower half
    return (-max_heap[0] + min_heap[0]) / 2  # even total — average the two middles`
      },
      {
        label: "Sliding Window Median",
        hint: "'median of every window of size k', elements slide in and out — need median continuously as window moves",
        code: `import heapq
from collections import defaultdict

def medianSlidingWindow(nums, k):
    lo, hi = [], []     # max_heap (lower), min_heap (upper)
    result = []
    lazy = defaultdict(int)  # lazy deletion: mark elements to remove later
    # we can't remove from middle of heap efficiently, so we delay deletions

    def rebalance():
        # flush any "deleted" elements sitting at the top of either heap
        while lo and lazy[-lo[0]] > 0:
            lazy[-lo[0]] -= 1
            heapq.heappop(lo)
        while hi and lazy[hi[0]] > 0:
            lazy[hi[0]] -= 1
            heapq.heappop(hi)

    for i, num in enumerate(nums):
        heapq.heappush(lo, -num)
        heapq.heappush(hi, -heapq.heappop(lo))  # balance ordering
        if len(hi) > len(lo):
            heapq.heappush(lo, -heapq.heappop(hi))  # keep lo >= hi in size

        if i >= k - 1:  # window is full — compute median
            rebalance()
            median = -lo[0] if k % 2 else (-lo[0] + hi[0]) / 2
            result.append(median)

            out = nums[i - k + 1]   # element leaving the window
            lazy[out] += 1          # mark it for lazy deletion
            # re-balance after marking deletion
            if out <= -lo[0]:
                heapq.heappush(hi, -heapq.heappop(lo))
            else:
                heapq.heappush(lo, -heapq.heappop(hi))

    return result`
      }
    ],
    confusables: [
      {
        other: "Top K Elements / Heap",
        similarity: "Both use heaps",
        difference: "Two Heaps tracks the median by keeping two balanced halves. Top K just keeps the k best elements in one heap.",
        rule: "Problem says 'median' or 'balance two halves' → Two Heaps. Problem says 'top k' or 'kth largest/smallest' → Single Heap."
      },
      {
        other: "Sorting",
        similarity: "Both can give you the median",
        difference: "Sorting works if all the data is available upfront. Two Heaps is for streaming data where new numbers keep arriving and you can't re-sort every time.",
        rule: "Data is static and fully available → Sort then index the middle. Data arrives one at a time (stream / addNum) → Two Heaps."
      }
    ]
  },
  {
    name: "DFS (Binary Trees)",
    color: "#f9ca24",
    keywords: ["preorder", "inorder", "postorder", "tree traversal", "serialize", "path", "root to leaf", "binary tree"],
    tells: [
      "Need to visit every node in a specific order",
      "Root-to-leaf path problems",
      "Serialize or reconstruct a tree",
      "No need to combine left + right (just visit)"
    ],
    example: "Binary Tree Paths, Path Sum, Serialize/Deserialize, Inorder Traversal",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Decide traversal order: preorder (root first), inorder (root middle), postorder (root last)",
      "Preorder: process node → recurse left → recurse right (use for serialization, copying)",
      "Inorder: recurse left → process node → recurse right (use for BST sorted order)",
      "Postorder: recurse left → recurse right → process node (use for deletion, bottom-up)",
      "For root-to-leaf paths: carry a path list down, append node, record at leaf, pop on return",
      "Base case: if not node → return (null check always first)",
      "If iterative required: use an explicit stack to simulate the call stack"
    ],
    templates: [
      {
        label: "Preorder (root → left → right)",
        hint: "'serialize a tree', 'copy a tree', 'preorder traversal' — need to process the root before its children",
        code: `# Preorder: visit root FIRST, then recurse into children
# Use for: serialization, copying a tree, prefix expression

def preorder(node):
    if not node: return
    result.append(node.val)   # process root before children
    preorder(node.left)
    preorder(node.right)

# Iterative version (uses stack)
def preorder_iterative(root):
    if not root: return []
    stack, result = [root], []
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.right: stack.append(node.right)  # push right first
        if node.left:  stack.append(node.left)   # so left is popped first
    return result`
      },
      {
        label: "Inorder (left → root → right)",
        hint: "'inorder traversal', 'kth smallest in BST', 'sorted order from tree' — BST inorder always gives sorted output",
        code: `# Inorder: visit left subtree, THEN root, then right
# Use for: BST sorted order, kth smallest, validate BST

def inorder(node):
    if not node: return
    inorder(node.left)
    result.append(node.val)   # process root between children
    inorder(node.right)

# Iterative version (uses stack)
def inorder_iterative(root):
    stack, result = [], []
    curr = root
    while curr or stack:
        while curr:               # go as far left as possible
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()        # backtrack
        result.append(curr.val)   # process node
        curr = curr.right         # now go right
    return result`
      },
      {
        label: "Postorder (left → right → root)",
        hint: "'delete a tree', 'evaluate expression tree', 'postorder traversal' — need both children processed before the parent",
        code: `# Postorder: visit both children BEFORE root
# Use for: deleting a tree, evaluating expression trees, bottom-up problems

def postorder(node):
    if not node: return
    postorder(node.left)
    postorder(node.right)
    result.append(node.val)   # process root AFTER both children

# Iterative version
def postorder_iterative(root):
    if not root: return []
    stack, result = [root], []
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.left:  stack.append(node.left)   # push left first
        if node.right: stack.append(node.right)  # so right is popped and processed first
    return result[::-1]  # reverse gives postorder`
      },
      {
        label: "Root-to-Leaf Paths",
        hint: "'all root to leaf paths', 'path sum', 'sum of root to leaf numbers' — need to track the full path as you go down",
        code: `# Use when the problem involves paths from root down to leaves
# e.g. Path Sum, Binary Tree Paths, Sum Root to Leaf Numbers

def dfs(node, path, result):
    if not node: return
    path.append(node.val)   # add current node to path

    if not node.left and not node.right:
        result.append(path[:])  # reached a leaf — record this path
        # path[:] makes a copy — if you just append path, it'll be mutated later

    dfs(node.left,  path, result)
    dfs(node.right, path, result)
    path.pop()  # backtrack — remove current node so sibling paths are clean

result = []
dfs(root, [], result)
return result`
      }
    ],
    confusables: [
      {
        other: "DFS with Return Value (Trees)",
        similarity: "Both use recursive DFS on a binary tree",
        difference: "Plain tree DFS just visits nodes and collects/processes values. DFS with return value computes something at each node using children's results and passes it upward.",
        rule: "Just visiting nodes in order, collecting paths, or processing each node? → Plain tree DFS. Need to combine left + right subtree results at each node? → DFS with return value."
      },
      {
        other: "BFS (Graph/Matrix)",
        similarity: "Both traverse every node in a binary tree",
        difference: "DFS goes deep along one branch before backtracking. BFS processes all nodes level by level.",
        rule: "Need nodes in level order, or the answer depends on depth/level? → BFS. Need to follow a path root-to-leaf, or order within a subtree matters? → DFS."
      }
    ]
  },
  {
    name: "DFS with Return Value (Trees)",
    color: "#2bcbba",
    keywords: ["diameter", "height", "balanced", "max path sum", "lowest common ancestor", "combine left and right"],
    tells: [
      "Need info from BOTH left and right children",
      "Can't answer at current node without children's answers first",
      "Computing something that depends on subtree results"
    ],
    example: "Diameter of Binary Tree, Max Path Sum, Balanced Binary Tree",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Base case: if not node → return 0 (or -inf, or None depending on problem)",
      "Recurse left: left = dfs(node.left) — get left subtree's answer",
      "Recurse right: right = dfs(node.right) — get right subtree's answer",
      "Combine: use left + right to compute the answer AT this node (e.g. diameter, max path)",
      "Update global result: self.result = max(self.result, combined_value)",
      "Return UP: return something useful to the parent (usually 1 + max(left, right) for height)",
      "Key insight: the value returned UP is different from the global answer updated at each node"
    ],
    templates: [
      {
        label: "Height / Diameter",
        hint: "'diameter of binary tree', 'height of tree', 'longest path between any two nodes' — answer passes through a node using both its subtrees",
        code: `self.diameter = 0

def dfs(node):
    if not node: return 0       # null node contributes 0 height
    left  = dfs(node.left)      # get height of left subtree
    right = dfs(node.right)     # get height of right subtree
    # diameter through this node = left path + right path
    self.diameter = max(self.diameter, left + right)
    return 1 + max(left, right) # return height of THIS node to its parent

dfs(root)
return self.diameter`
      },
      {
        label: "Check Balanced",
        hint: "'is the tree height-balanced', 'balanced binary tree' — need height from both subtrees at every node to check the difference",
        code: `def dfs(node):
    if not node: return 0
    left  = dfs(node.left)
    right = dfs(node.right)
    if left == -1 or right == -1: return -1  # child already found imbalance — propagate up
    if abs(left - right) > 1:    return -1   # this node is unbalanced
    return 1 + max(left, right)              # balanced — return height normally

return dfs(root) != -1  # -1 means unbalanced somewhere`
      },
      {
        label: "Lowest Common Ancestor",
        hint: "'lowest common ancestor', 'LCA of two nodes' — need to find where two nodes' paths first meet going up the tree",
        code: `def dfs(node):
    if not node or node == p or node == q:
        return node   # found one of the targets (or hit null)
    left  = dfs(node.left)   # search left subtree
    right = dfs(node.right)  # search right subtree
    if left and right:
        return node    # p found on one side, q on the other — this node is LCA
    return left or right  # both found on same side — pass up whichever is non-null`
      },
      {
        label: "Max Path Sum",
        hint: "'maximum path sum', 'path can start and end at any node' — path goes through a node using both left and right branches",
        code: `self.max_sum = float('-inf')

def dfs(node):
    if not node: return 0
    left  = max(dfs(node.left),  0)  # ignore negative paths — they hurt the sum
    right = max(dfs(node.right), 0)
    # candidate path that passes through this node: left branch + node + right branch
    self.max_sum = max(self.max_sum, left + right + node.val)
    # return only ONE direction to parent (can't go both ways up the tree)
    return node.val + max(left, right)

dfs(root)
return self.max_sum`
      }
    ],
    confusables: [
      {
        other: "BFS (Graph/Matrix)",
        similarity: "Both traverse a tree",
        difference: "BFS (level order) processes nodes row by row using a queue. DFS with return value goes deep first and bubbles computed answers back up to the parent.",
        rule: "Problem mentions 'level', 'depth', or 'row' → BFS. Need to combine left and right subtree results at each node → DFS with return value."
      },
      {
        other: "DFS (Graph/Matrix)",
        similarity: "Both are DFS",
        difference: "Graph DFS just visits nodes and marks them. Tree DFS with return value computes something at each node using its children's results and passes it upward.",
        rule: "Does each node need to return a value that its parent uses to compute its own answer? Yes → DFS with return value. Just visiting/marking? → plain DFS."
      }
    ]
  },
  {
    name: "BST Patterns",
    color: "#45aaf2",
    keywords: ["binary search tree", "kth smallest", "validate BST", "inorder", "sorted order from tree"],
    tells: [
      "Inorder traversal of BST = sorted array",
      "Kth smallest → inorder until kth element",
      "Validate BST → pass min/max bounds down",
      "Search/insert → go left or right by value"
    ],
    example: "Kth Smallest in BST, Validate BST, Inorder Successor",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Exploit the BST property: left subtree < root < right subtree",
      "For sorted order / kth smallest: use inorder traversal (left → root → right gives sorted sequence)",
      "For search / insert: at each node, go left if target < node.val, right if target > node.val",
      "For validation: pass min and max bounds down — each node must be strictly within its inherited bounds",
      "For LCA in BST: if both targets < root → go left, both > root → go right, split → root is LCA",
      "Never need to visit both subtrees if you can prune based on the BST property"
    ],
    templates: [
      {
        label: "Inorder Traversal (sorted order)",
        hint: "'inorder traversal of BST', 'sorted output from BST', 'convert BST to sorted array' — inorder = sorted for any BST",
        code: `result = []

def inorder(node):
    if not node: return
    inorder(node.left)           # visit entire left subtree first (smaller values)
    result.append(node.val)      # visit current node — this is in sorted order for BST
    inorder(node.right)          # visit right subtree (larger values)

inorder(root)
return result`
      },
      {
        label: "Validate BST",
        hint: "'validate binary search tree', 'is this a valid BST' — every node must be within inherited min/max bounds from its ancestors",
        code: `def validate(node, min_val, max_val):
    if not node: return True
    # every node must be strictly between its inherited bounds
    if node.val <= min_val or node.val >= max_val:
        return False
    return (
        validate(node.left,  min_val,   node.val) and  # left child must be < current
        validate(node.right, node.val,  max_val)        # right child must be > current
    )

return validate(root, float('-inf'), float('inf'))`
      },
      {
        label: "Search / Insert",
        hint: "'search in BST', 'insert into BST' — exploit sorted property to go left or right at each node instead of visiting both",
        code: `# Search — O(h) where h = height
def search(node, target):
    if not node: return None          # not found
    if node.val == target: return node
    if target < node.val:
        return search(node.left,  target)  # target is smaller — go left
    else:
        return search(node.right, target)  # target is larger — go right

# Insert — same navigation, create node at the null spot
def insert(node, val):
    if not node: return TreeNode(val)  # found the right empty spot
    if val < node.val:
        node.left  = insert(node.left,  val)
    else:
        node.right = insert(node.right, val)
    return node`
      },
      {
        label: "Kth Smallest",
        hint: "'kth smallest element in BST' — inorder gives sorted order, so the kth node visited = kth smallest",
        code: `self.k = k
self.result = None

def inorder(node):
    if not node or self.result: return   # stop early once answer found
    inorder(node.left)    # go left first — smallest values
    self.k -= 1           # count down each time we visit a node
    if self.k == 0:
        self.result = node.val  # kth node visited in inorder = kth smallest
        return
    inorder(node.right)

inorder(root)
return self.result`
      }
    ],
    confusables: [
      {
        other: "Binary Search",
        similarity: "Both eliminate half the options at each step",
        difference: "Binary search runs on a sorted array. BST patterns run on a tree node structure. The go-left/go-right logic is similar but the data structure is completely different.",
        rule: "Input is an array → Binary Search. Input is a tree with node.left / node.right → BST traversal."
      },
      {
        other: "DFS with Return Value (Trees)",
        similarity: "Both recursively traverse a binary tree",
        difference: "BST patterns exploit the sorted property (left < root < right) to skip entire subtrees. DFS with return value works on any binary tree and can't skip — it must visit both sides.",
        rule: "Is it a BST and can you prune based on value? → BST pattern. Is it a general binary tree or do you need info from both sides regardless of value? → DFS with return value."
      }
    ]
  },
  {
    name: "BFS (Graph/Matrix)",
    color: "#FC5C65",
    keywords: ["shortest path", "minimum steps", "level order", "closest", "nearest", "how many steps"],
    tells: [
      "Shortest path in unweighted graph",
      "Level-by-level tree traversal",
      "Minimum number of moves/steps",
      "Spreading outward (like rotten oranges)"
    ],
    example: "Word Ladder, Rotting Oranges, Shortest Path in Binary Matrix",
    constraint: { label: "n ≤ 10^6 · O(V+E)", color: "#f9ca24" },
    approach: [
      "Initialize a queue with the starting node(s) and a visited set",
      "Process level by level: use for _ in range(len(queue)) to process one full level at a time",
      "For each node dequeued: check if it's the target (return steps if so)",
      "Get all valid neighbors (check bounds, not visited, not blocked)",
      "Mark neighbors as visited BEFORE enqueuing (not after) to avoid duplicates",
      "Enqueue valid neighbors and increment steps after finishing each level",
      "For multi-source BFS (rotten oranges): seed the queue with ALL starting nodes at once"
    ],
    templates: [
      {
        label: "Graph (shortest path)",
        hint: "'shortest path', 'minimum hops', 'word ladder', 'fewest steps between nodes' — input is edges/adjacency list",
        code: `from collections import deque
queue = deque([start])
visited = {start}  # track visited so we don't loop forever
steps = 0

while queue:
    # process all nodes at the current distance before going deeper
    for _ in range(len(queue)):
        node = queue.popleft()
        if node == target: return steps  # found it at this distance
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    steps += 1  # finished one full level — increment distance`
      },
      {
        label: "Matrix / Grid",
        hint: "'shortest path in grid', 'minimum steps in matrix', 'rotting oranges', 'nearest 0' — input is a 2D grid",
        code: `from collections import deque
directions = [(0,1),(0,-1),(1,0),(-1,0)]  # right, left, down, up
queue = deque([(r0, c0)])
visited = {(r0, c0)}
steps = 0

while queue:
    for _ in range(len(queue)):
        r, c = queue.popleft()
        if (r, c) == target: return steps
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols   # in bounds
               and (nr, nc) not in visited           # not already seen
               and grid[nr][nc] != 0):               # not blocked
                visited.add((nr, nc))
                queue.append((nr, nc))
    steps += 1`
      },
      {
        label: "Tree Level Order",
        hint: "'level order traversal', 'nodes at each depth', 'right side view', 'average of levels' — answer depends on which level a node is on",
        code: `from collections import deque
queue = deque([root])
result = []

while queue:
    level = []
    for _ in range(len(queue)):  # process exactly one level at a time
        node = queue.popleft()
        level.append(node.val)
        if node.left:  queue.append(node.left)   # add children for next level
        if node.right: queue.append(node.right)
    result.append(level)  # one full level collected

return result`
      }
    ],
    confusables: [
      {
        other: "DFS (Graph/Matrix)",
        similarity: "Both explore a graph or matrix",
        difference: "BFS guarantees the shortest path because it explores level by level. DFS goes deep first and may find a longer path first.",
        rule: "Need MINIMUM steps or SHORTEST path → always BFS. Just need to check 'can you reach' or 'count regions' → DFS is fine."
      },
      {
        other: "Backtracking",
        similarity: "Both explore paths in a graph or grid",
        difference: "BFS explores all neighbors simultaneously and never revisits. Backtracking undoes visited markings so it can reuse cells to explore all possible paths.",
        rule: "Need shortest path or minimum moves → BFS. Need all possible paths or a specific sequence using cells multiple times → Backtracking."
      }
    ]
  },
  {
    name: "DFS (Graph/Matrix)",
    color: "#26de81",
    keywords: ["number of islands", "connected components", "flood fill", "regions", "can reach", "explore"],
    tells: [
      "Count connected regions in a grid given upfront",
      "Check if path exists",
      "Explore all reachable cells",
      "Mark visited and never revisit",
      "Grid is static (all cells known at start) — if cells added dynamically use Union Find"
    ],
    example: "Number of Islands, Flood Fill, Pacific Atlantic Water Flow",
    constraint: { label: "n ≤ 10^6 · O(V+E)", color: "#f9ca24" },
    approach: [
      "Check base cases first: out of bounds, already visited, or blocked cell → return",
      "Mark the current cell as visited BEFORE recursing (prevents infinite loops)",
      "Recurse into all 4 neighbors (or 8 if diagonal movement allowed)",
      "For counting components: call dfs from each unvisited valid cell in the main loop, increment count each time",
      "For flood fill: change the cell's value as you visit it instead of a separate visited array",
      "For adjacency list graphs: use a visited set, recurse into unvisited neighbors"
    ],
    templates: [
      {
        label: "Grid / Matrix",
        hint: "'number of islands', 'flood fill', 'count connected regions' — input is a 2D grid, just need to explore/count",
        code: `def dfs(r, c):
    # base cases: stop if out of bounds, already visited, or blocked cell
        return
    if visited[r][c] or grid[r][c] == '0':
        return
    visited[r][c] = True  # mark before recursing so we don't revisit
    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
        dfs(r + dr, c + dc)  # explore all 4 neighbors

count = 0
for r in range(rows):
    for c in range(cols):
        if not visited[r][c] and grid[r][c] == '1':
            dfs(r, c)    # floods entire connected region
            count += 1   # one full DFS = one island`
      },
      {
        label: "Graph (adjacency list)",
        hint: "'number of provinces', 'friend circles', 'connected components' — input is a list of edges or adjacency list, not a grid",
        code: `visited = set()

def dfs(node):
    visited.add(node)  # mark before exploring neighbors to avoid infinite loop
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor)  # recurse into unvisited neighbors

components = 0
for node in graph:
    if node not in visited:
        dfs(node)        # explores the entire connected component
        components += 1  # each fresh DFS call = one new component`
      }
    ],
    confusables: [
      {
        other: "BFS (Graph/Matrix)",
        similarity: "Both explore a graph or matrix",
        difference: "DFS dives deep immediately and marks cells permanently visited. BFS spreads level by level and guarantees shortest path.",
        rule: "Need minimum distance or shortest path → BFS. Just need to explore, count, or check reachability → DFS."
      },
      {
        other: "Backtracking",
        similarity: "Both use recursive exploration on a grid",
        difference: "DFS marks a cell visited and never unmarks it — a cell belongs to one region permanently. Backtracking unmarks after recursion so other paths can reuse the same cell.",
        rule: "Can the same cell appear in multiple valid answers? Yes → Backtracking (unmark after). No → DFS (mark permanently)."
      }
    ]
  },
  {
    name: "Graph / Adjacency List",
    color: "#8854d0",
    keywords: ["prerequisites", "dependencies", "routes", "connections", "network", "accounts", "shared", "course schedule"],
    tells: [
      "Things are connected to other things",
      "Two entities share something (stops, emails, friends)",
      "Need to find groups, paths, or cycles",
      "Ask yourself: what are the nodes? what are the edges?"
    ],
    example: "Course Schedule, Bus Routes, Accounts Merge, Number of Provinces",
    constraint: { label: "n ≤ 10^6 · O(V+E)", color: "#f9ca24" },
    approach: [
      "Ask yourself: what are the NODES and what are the EDGES? Write it out before coding",
      "Build the adjacency list: for each edge (u,v), add v to graph[u] (and u to graph[v] if undirected)",
      "For topological sort: also track indegree of each node",
      "Choose traversal: BFS for shortest path / topological sort, DFS for components / cycle detection",
      "Use a visited set to avoid revisiting nodes",
      "For topological sort: seed queue with all nodes of indegree 0, decrement neighbors as you process",
      "For cycle detection in directed graph: use 3 states (unvisited=0, in-progress=1, done=2)"
    ],
    templates: [
      {
        label: "Build + DFS Traversal",
        hint: "'number of provinces', 'accounts merge', 'connected components from edge list' — input is pairs of connections, not a grid",
        code: `from collections import defaultdict
graph = defaultdict(list)
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)  # both directions for undirected graph (remove for directed)

visited = set()

def dfs(node):
    visited.add(node)              # mark before visiting neighbors to avoid cycles
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor)          # explore entire connected component

components = 0
for node in graph:
    if node not in visited:
        dfs(node)        # one call explores the whole connected component
        components += 1`
      },
      {
        label: "Build + BFS Traversal",
        hint: "same as DFS version above, but use BFS when you ALSO need shortest path / distance between nodes in the same traversal",
        code: `from collections import defaultdict, deque
graph = defaultdict(list)
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)  # both directions for undirected graph (remove for directed)

visited = set()

def bfs(start):
    queue = deque([start])
    visited.add(start)              # mark before enqueueing to avoid duplicates
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)  # explores level by level

components = 0
for node in graph:
    if node not in visited:
        bfs(node)        # one call explores the whole connected component
        components += 1

# DFS vs BFS here: both correctly count/explore components.
# Use BFS instead of DFS when you also need shortest distance between nodes.`
      },
      {
        label: "Topological Sort (Course Schedule)",
        hint: "'course schedule', 'task ordering', 'prerequisites' — need a valid ordering where dependencies come first, detect cycle if impossible",
        code: `from collections import defaultdict, deque
graph = defaultdict(list)
indegree = defaultdict(int)  # how many prerequisites each course has

for a, b in prerequisites:
    graph[b].append(a)   # b must come before a
    indegree[a] += 1     # a has one more prerequisite

# start with all nodes that have no prerequisites
queue = deque([n for n in range(numCourses) if indegree[n] == 0])
order = []

while queue:
    node = queue.popleft()
    order.append(node)
    for neighbor in graph[node]:
        indegree[neighbor] -= 1          # one prerequisite satisfied
        if indegree[neighbor] == 0:
            queue.append(neighbor)       # all prerequisites done — ready to take

# if order has all courses, no cycle exists and topological order is valid
return order if len(order) == numCourses else []`
      },
      {
        label: "Cycle Detection (Directed Graph)",
        hint: "'detect cycle in directed graph', 'can all courses be finished' — undirected cycle use Union Find instead, directed cycle use 3-color DFS",
        code: `# 3-color DFS: unvisited=0, in-progress=1, fully-done=2
state = [0] * n

def dfs(node):
    if state[node] == 1: return True   # hit a node still in current path = back edge = cycle
    if state[node] == 2: return False  # already fully explored, no cycle from here
    state[node] = 1  # mark as in-progress
    for neighbor in graph[node]:
        if dfs(neighbor): return True
    state[node] = 2  # fully done — no cycle found from this node
    return False

return any(dfs(i) for i in range(n) if state[i] == 0)`
      }
    ],
    confusables: [
      {
        other: "Union Find (DSU)",
        similarity: "Both handle connected components and grouping",
        difference: "Graph + BFS/DFS is needed when you need to traverse paths, detect cycles with ordering (topological sort), or find shortest paths. Union Find just answers 'are these connected' efficiently.",
        rule: "Need path info, ordering, or shortest path → Graph + BFS/DFS. Just need to check or merge group membership → Union Find."
      },
      {
        other: "DFS (Graph/Matrix)",
        similarity: "Both use DFS on a graph",
        difference: "Matrix DFS works directly on a 2D grid using row/col coordinates. Adjacency list DFS builds an explicit graph from edges first, then traverses it.",
        rule: "Input is a 2D grid → Matrix DFS. Input is a list of edges or relationships between nodes → Build adj list first."
      }
    ]
  },
  {
    name: "Union Find (DSU)",
    color: "#fa8231",
    keywords: ["connected components", "detect cycle", "union", "same group", "redundant connection", "dynamic connectivity", "number of groups", "after each operation", "after each addition", "connecting", "merging groups", "number of islands II"],
    tells: [
      "Dynamically merging groups/components over time",
      "Detecting cycles in undirected graphs",
      "Checking if two nodes are connected",
      "'After each operation/addition' — need running component count",
      "Grid where cells are added dynamically (not given upfront)",
      "Static grid given upfront → use DFS/BFS instead"
    ],
    example: "Redundant Connection, Number of Provinces, Accounts Merge",
    constraint: { label: "n ≤ 10^6 · O(α(n))", color: "#f9ca24" },
    approach: [
      "Build a DSU class with __init__(self, n) setting self.parent = list(range(n)) and self.rank = [1] * n",
      "Implement find(node): loop up the parent chain with path compression, return the root",
      "Implement union(u, v): find roots of both. If same root → already connected (cycle). Else merge by rank and return True",
      "For cycle detection: if union returns False (same root) → that edge is redundant",
      "For counting components: start res = n, decrement res by 1 every time union() returns True",
      "For dynamic grid problems: run union on adjacent land cells as they're added, track component count",
      "Wrapping find/union in a class keeps state clean and makes the code reusable across multiple problems"
    ],
    templates: [
      {
        label: "Core Template (DSU Class)",
        hint: "any problem where you need to dynamically merge groups and check membership — use this as your starting skeleton",
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))  # each node starts as its own parent (its own group)
        self.rank = [1] * n           # rank = approximate tree size, keeps tree flat

    def find(self, node):
        cur = node
        while cur != self.parent[cur]:
            # path compression (path halving): point to grandparent each step
            self.parent[cur] = self.parent[self.parent[cur]]
            cur = self.parent[cur]
        return cur  # cur is now the root of this group

    def union(self, u, v):
        pu = self.find(u)   # root of u's group
        pv = self.find(v)   # root of v's group
        if pu == pv:
            return False     # already in same group — adding edge = cycle
        # attach smaller-rank tree under larger-rank tree to keep depth minimal
        if self.rank[pv] > self.rank[pu]:
            pu, pv = pv, pu
        self.parent[pv] = pu      # merge groups
        self.rank[pu] += self.rank[pv]  # update rank of new root
        return True

# Usage:
dsu = DSU(n)
for u, v in edges:
    dsu.union(u, v)`
      },
      {
        label: "Detect Cycle (Redundant Connection)",
        hint: "'redundant connection', 'find the edge that creates a cycle in undirected graph' — if union returns False, that edge connects already-connected nodes",
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n

    def find(self, node):
        cur = node
        while cur != self.parent[cur]:
            self.parent[cur] = self.parent[self.parent[cur]]  # path compression
            cur = self.parent[cur]
        return cur

    def union(self, u, v):
        pu, pv = self.find(u), self.find(v)
        if pu == pv:
            return False   # already connected — this edge is redundant
        if self.rank[pv] > self.rank[pu]:
            pu, pv = pv, pu
        self.parent[pv] = pu
        self.rank[pu] += self.rank[pv]
        return True

class Solution:
    def findRedundantConnection(self, edges):
        n = len(edges)
        dsu = DSU(n + 1)  # 1-indexed nodes

        for u, v in edges:
            if not dsu.union(u, v):
                return [u, v]  # this edge creates a cycle — it's redundant`
      },
      {
        label: "Count Connected Components",
        hint: "'number of connected components', 'how many separate groups' — count unique roots after all unions are done",
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n

    def find(self, node):
        cur = node
        while cur != self.parent[cur]:
            self.parent[cur] = self.parent[self.parent[cur]]  # path compression
            cur = self.parent[cur]
        return cur

    def union(self, u, v):
        pu, pv = self.find(u), self.find(v)
        if pu == pv:
            return False   # already same group — nothing merged
        if self.rank[pv] > self.rank[pu]:
            pu, pv = pv, pu
        self.parent[pv] = pu
        self.rank[pu] += self.rank[pv]
        return True

class Solution:
    def countComponents(self, n, edges):
        dsu = DSU(n)
        res = n  # start assuming every node is its own component

        for u, v in edges:
            if dsu.union(u, v):
                res -= 1   # successful merge — one fewer component

        return res`
      }
    ],
    confusables: [
      {
        other: "Graph / Adjacency List",
        similarity: "Both handle connected components",
        difference: "Union Find is nearly O(1) per query for pure connectivity checks. Graph + DFS/BFS is needed when you need actual paths, topological ordering, or shortest distances.",
        rule: "Just checking if two nodes are in the same group → Union Find. Need to traverse paths, find order, or shortest distance → Graph + BFS/DFS."
      },
      {
        other: "DFS (Graph/Matrix)",
        similarity: "Both can count connected components",
        difference: "DFS explores the full structure of each component. Union Find just tracks group membership without knowing the structure. Both work for static problems.",
        rule: "Static grid, just count components → either works, DFS is simpler to code. Edges or cells added dynamically over time → Union Find is the only practical choice. Key question: is the full grid given upfront or built one cell at a time?"
      }
    ]
  },
  {
    name: "Backtracking",
    color: "#fd9644",
    keywords: ["all combinations", "all permutations", "all subsets", "generate all", "word search", "find all paths", "N-Queens", "list all", "return all possible", "find all valid"],
    tells: [
      "Need ALL valid combinations, not just one",
      "Build a solution step by step and undo if invalid",
      "Same cell/element could appear in multiple answers",
      "Constraint satisfaction (place, check, unplace)",
      "Phrasing: 'find ALL', 'list ALL', 'return all possible' → Backtracking",
      "Phrasing: 'number of', 'how many', 'count' → DP instead",
      "Output type: LIST of solutions (exponential time O(2^n) or O(n!))",
      "Hierarchy: Backtracking = ALL solutions · DP = OPTIMAL (checks all subproblems) · Greedy = OPTIMAL (one pass, no backtracking)"
    ],
    example: "Word Search, Subsets, Permutations, Combination Sum",
    constraint: { label: "n ≤ 20 · O(2^n or n!)", color: "#26de81" },
    approach: [
      "Define the base case: when is the current path a complete valid solution? → record it",
      "Define the choices: what are the valid next elements to add at each step?",
      "Choose: add the element to the current path",
      "Recurse: call backtrack with updated state (next start index, next position, etc.)",
      "Unchoose (undo): remove the element from the path — this is what makes it backtracking",
      "For combinations: pass a start index to avoid reusing earlier elements",
      "For permutations: use a used[] boolean array to track which elements are in the current path",
      "For grid problems: overwrite the cell to mark visited, restore it after recursion"
    ],
    templates: [
      {
        label: "Non-Grid (combinations / subsets)",
        hint: "'all subsets', 'all combinations', 'combination sum' — picking elements from a list, order doesn't matter",
        code: `result = []

def backtrack(start, path):
    result.append(path[:])  # snapshot current path — [:] copies it, not a reference
    for i in range(start, len(nums)):
        path.append(nums[i])      # choose: add this element to current combo
        backtrack(i + 1, path)    # explore: recurse with remaining elements
        # (use i instead of i+1 if elements can be reused, e.g. Combination Sum)
        path.pop()                # undo: remove so next loop iteration starts fresh

backtrack(0, [])
return result`
      },
      {
        label: "Non-Grid (permutations)",
        hint: "'all permutations', 'all arrangements' — same elements, different orderings, every element used exactly once",
        code: `result = []

def backtrack(path, used):
    if len(path) == len(nums):
        result.append(path[:])  # found a complete permutation
        return
    for i in range(len(nums)):
        if used[i]: continue     # skip elements already in current path
        used[i] = True
        path.append(nums[i])     # choose this element
        backtrack(path, used)    # explore further
        path.pop()               # undo choice
        used[i] = False          # undo used mark so other branches can use it

backtrack([], [False] * len(nums))
return result`
      },
      {
        label: "Grid (Word Search)",
        hint: "'word search', 'find word in grid', 'path exists in matrix' — need to explore directions AND undo visits so other paths can reuse cells",
        code: `def backtrack(r, c, i):
    if i == len(word): return True   # matched all characters — found it
    if r < 0 or r >= rows or c < 0 or c >= cols:
        return False                 # out of bounds
    if board[r][c] != word[i]: return False  # wrong character

    temp = board[r][c]
    board[r][c] = '#'  # mark cell as visited by overwriting it temporarily
    # (prevents using the same cell twice in one path)

    found = any(
        backtrack(r + dr, c + dc, i + 1)
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]
    )

    board[r][c] = temp  # undo: restore original character so other paths can use this cell
    return found`
      }
    ],
    confusables: [
      {
        other: "DFS (Graph/Matrix)",
        similarity: "Both recursively explore a grid or graph",
        difference: "The single biggest difference: backtracking UNMARKS visited cells after recursion so other branches can reuse them. DFS marks permanently and never unmarks.",
        rule: "Do you see `visited.remove()` or restoring a cell after the recursive call? → Backtracking. Mark once and never touch again? → DFS."
      },
      {
        other: "Dynamic Programming",
        similarity: "Both explore multiple possibilities",
        difference: "Backtracking generates all possibilities explicitly and is exponential time. DP stores subproblem results to avoid redundant work.",
        rule: "Problem asks for ALL solutions listed (find all combos/permutations) → Backtracking. Problem asks for COUNT or OPTIMAL → DP. See the word 'combinations'? 'all combinations' → Backtracking, 'number of combinations' → DP."
      }
    ]
  },
  {
    name: "Dynamic Programming",
    color: "#eb3b5a",
    keywords: ["maximum/minimum", "how many ways", "can you reach", "optimal", "count paths", "longest increasing", "knapsack", "partition", "number of ways", "longest subsequence", "shortest subsequence", "does s match p", "edit distance", "wildcard", "regular expression", "distinct subsequences", "subset sum", "partition equal subset", "unbounded knapsack", "0/1 knapsack", "number of combinations", "count combinations", "how many combinations"],
    tells: [
      "Overlapping subproblems (same subproblem solved repeatedly)",
      "Optimal substructure (optimal answer built from optimal sub-answers)",
      "'How many ways' or 'max/min value'",
      "Decision at each step affects future steps",
      "Two strings being compared/matched/transformed character by character",
      "Phrasing: 'number of combinations/ways/paths' → DP (not backtracking)",
      "Phrasing: 'find ALL / list ALL combinations' → Backtracking instead",
      "Output type: ONE optimal answer — explores all subproblems to prove it (polynomial time)",
      "Hierarchy: Backtracking = ALL solutions · DP = OPTIMAL (checks all subproblems) · Greedy = OPTIMAL (one pass, no backtracking)"
    ],
    example: "Climbing Stairs, Coin Change, Longest Increasing Subsequence",
    constraint: { label: "n ≤ 10^6 · O(n) or O(n²)", color: "#f9ca24" },
    approach: [
      "Define the STATE: what does dp[i] (or dp[i][j]) represent? Write this out explicitly before coding",
      "Write the RECURRENCE: how does dp[i] relate to previous states? What decision is made at each step?",
      "Set BASE CASES: what are the smallest subproblems whose answers you know directly?",
      "Choose DIRECTION: top-down (start at answer, memoize) or bottom-up (start at base, build up)?",
      "For 2D DP: define dp[i][j], write recurrence using dp[i-1][j], dp[i][j-1], dp[i-1][j-1]",
      "Determine RETURN: which cell holds the final answer? (usually dp[n] or dp[m][n])",
      "Optimize SPACE if needed: if each row only needs the previous row → use two 1D arrays (prev/curr)"
    ],
    templates: [
      {
        label: "Top-Down (memoization)",
        hint: "recursion feels natural but has repeated subproblems — add @lru_cache to cache results and avoid recomputing",
        code: `from functools import lru_cache

@lru_cache(maxsize=None)  # automatically caches results so each subproblem solved once
def dp(i):
    if i <= 1: return i           # base case — stop recursion here
    return dp(i - 1) + dp(i - 2) # recurrence — build answer from smaller subproblems

return dp(n)`
      },
      {
        label: "Bottom-Up 1D Unbounded Knapsack (Coin Change)",
        hint: "'minimum coins', 'fewest steps', 'how many ways to make amount X', each item reusable — loop FORWARD so same item can be used multiple times",
        code: `# dp[i] = minimum coins needed to make amount i
dp = [float('inf')] * (amount + 1)
dp[0] = 0  # base case: 0 coins needed to make amount 0

for coin in coins:
    for amt in range(coin, amount + 1):
        # option 1: don't use this coin — dp[amt] stays
        # option 2: use this coin — 1 + whatever it took to make (amt - coin)
        dp[amt] = min(dp[amt], dp[amt - coin] + 1)

return dp[amount] if dp[amount] != float('inf') else -1`
      },
      {
        label: "Bottom-Up 1D 0/1 Knapsack (each item once)",
        hint: "'partition equal subset sum', 'can you reach target using each number once', 'subset sum' — each item used at most once, loop BACKWARD to prevent reuse",
        code: `# 0/1 Knapsack: each item can be used AT MOST ONCE
# Key: loop BACKWARD so dp[cap - weight] reflects state WITHOUT current item
# (if you looped forward, you'd reuse the same item multiple times)

dp = [False] * (target + 1)
dp[0] = True  # can always make sum 0 (use no items)

for num in nums:
    for cap in range(target, num - 1, -1):  # ← loop BACKWARD
        # can we make 'cap' either without this num (dp[cap])
        # or by including this num (dp[cap - num])?
        dp[cap] = dp[cap] or dp[cap - num]

return dp[target]

# For MAX VALUE variant (classic knapsack):
# dp = [0] * (capacity + 1)
# for weight, value in items:
#     for cap in range(capacity, weight - 1, -1):  # ← backward
#         dp[cap] = max(dp[cap], dp[cap - weight] + value)`
      },
      {
        label: "Bottom-Up 2D (Unique Paths)",
        hint: "'unique paths in grid', 'number of ways to reach bottom-right' — answer at each cell depends on the cell above and to the left",
        code: `# dp[r][c] = number of ways to reach cell (r, c)
dp = [[1] * n for _ in range(m)]
# top row and left column are all 1 — only one way to reach them (straight line)

for r in range(1, m):
    for c in range(1, n):
        # can only come from above or from the left
        dp[r][c] = dp[r-1][c] + dp[r][c-1]
        #           ↑ from above    ↑ from left

return dp[m-1][n-1]

# ─── Space Optimized: O(n) instead of O(m×n) ───────────────────────
# Key insight: each row only depends on the row above it
# dp (the single array) = the ROW WE ARE CURRENTLY COMPUTING (dp[r])
# Before update: dp[c]   = dp[r-1][c] — value from ROW ABOVE
# After update:  dp[c]   = dp[r][c]   — value for CURRENT ROW
# dp[c-1] is already updated this iteration so it = dp[r][c-1] — value from LEFT

dp = [1] * n  # dp = dp[0] — top row, all 1s

for r in range(1, m):
    for c in range(1, n):
        dp[c] = dp[c] + dp[c - 1]
        # dp[c]   before update = dp[r-1][c]  — row above
        # dp[c-1] already updated  = dp[r][c-1]  — cell left
        # dp[c]   after update   = dp[r][c]    — current cell

return dp[n - 1]  # dp[n-1] = dp[m-1][n-1]`
      },
      {
        label: "Bottom-Up 2D Backwards (Space Optimized)",
        hint: "same as 2D unique paths but works backwards from bottom-right — useful when the problem naturally processes bottom-up",
        code: `# Full 2D version for reference:
# dp[r][c] = paths from (r,c) to bottom-right
# dp[r][c] = dp[r+1][c] + dp[r][c+1]   (go down or go right)
# dp[m-1][c] = 1 for all c  (bottom row: only one way — go right)
# dp[r][n-1] = 1 for all r  (right col: only one way — go down)

# ─── Space Optimized (one row at a time, backwards) ────────────────
# row    = the ROW BELOW the one we're currently computing (dp[r+1])
# newRow = the ROW WE ARE CURRENTLY COMPUTING              (dp[r])
# After each iteration: newRow becomes the new "row below" for the next row up

row = [1] * n  # dp[m-1] — bottom row, all 1s (only path: go right to end)

for i in range(m - 1):         # process each row above bottom, bottom-up
    newRow = [1] * n            # dp[current_row], rightmost col = 1

    for j in range(n - 2, -1, -1):   # right to left, skip last col (already 1)
        newRow[j] = newRow[j + 1] + row[j]
        # newRow[j+1] = dp[current_row][j+1]  — paths going RIGHT
        # row[j]      = dp[row_below][j]       — paths going DOWN
        # newRow[j]   = dp[current_row][j]     — total paths from this cell

    row = newRow  # current row becomes the new "row below" for next iteration
    # row    is now dp[current_row]
    # newRow will be dp[current_row - 1] on next iteration

return row[0]  # dp[0][0] = total unique paths from top-left to bottom-right`
      },
      {
        label: "Two-Choice per Step (House Robber)",
        hint: "'house robber', 'max sum no two adjacent', 'delete and earn' — at each position you choose to take it or skip it, can't take two in a row",
        code: `# dp[i] = max money robbing houses 0..i
# at each house: either skip it (take dp[i-1]) or rob it (take dp[i-2] + nums[i])

# Space optimized — only need previous two values, not full array
prev2 = 0  # dp[i-2]
prev1 = 0  # dp[i-1]

for num in nums:
    curr = max(prev1, prev2 + num)
    # max(skip this house, rob this house + best from 2 ago)
    prev2 = prev1  # shift window forward
    prev1 = curr

return prev1  # prev1 holds the answer for the full array`
      },
      {
        label: "Longest Increasing Subsequence",
        hint: "'longest increasing subsequence', 'longest chain', 'LIS' — elements don't have to be contiguous, just increasing",
        code: `# dp[i] = length of longest increasing subsequence ending at index i
dp = [1] * len(nums)  # every element alone is a subsequence of length 1

for i in range(1, len(nums)):
    for j in range(i):
        if nums[j] < nums[i]:          # nums[i] can extend the subsequence ending at j
            dp[i] = max(dp[i], dp[j] + 1)

return max(dp)  # best subsequence ending at any index`
      },
      {
        label: "2D String DP (Wildcard Matching)",
        hint: "'wildcard matching', '* matches any sequence', 'does s match pattern p' — two strings, dp[i][j] = does s[:i] match p[:j]",
        code: `# dp[i][j] = True if s[:i] matches p[:j]
m, n = len(s), len(p)
dp = [[False] * (n + 1) for _ in range(m + 1)]
dp[0][0] = True  # empty string matches empty pattern

# '*' can match empty sequence — handle first row
for j in range(1, n + 1):
    if p[j-1] == '*':
        dp[0][j] = dp[0][j-1]  # '*' matches zero chars of s
        #           ↑ cell left: did empty s match p[:j-1]?

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if p[j-1] == '*':
            dp[i][j] = dp[i][j-1] or dp[i-1][j]
            # dp[i][j-1]  — cell left:  '*' matches zero chars (ignore '*')
            # dp[i-1][j]  — row above:  '*' matches one more char of s
        elif p[j-1] == '?' or p[j-1] == s[i-1]:
            dp[i][j] = dp[i-1][j-1]
            #           ↑ diagonal: both s[i-1] and p[j-1] consumed

return dp[m][n]

# ─── Space Optimized: O(n) instead of O(m×n) ───────────────────────
# prev = the ROW ABOVE the one we're computing (dp[i-1])
# curr = the ROW WE ARE CURRENTLY COMPUTING    (dp[i])
# After each iteration: curr becomes the new prev for the next row

prev = [False] * (n + 1)  # prev = dp[0]
prev[0] = True             # dp[0][0] = True
for j in range(1, n + 1):
    prev[j] = prev[j-1] and p[j-1] == '*'  # dp[0][j]

for i in range(1, m + 1):
    curr = [False] * (n + 1)  # curr = dp[i], curr[0] = dp[i][0] = False
    for j in range(1, n + 1):
        if p[j-1] == '*':
            curr[j] = curr[j-1] or prev[j]
            # curr[j-1] = dp[i][j-1]  — cell left  (zero match)
            # prev[j]   = dp[i-1][j]  — row above  (one more match)
        elif p[j-1] == '?' or p[j-1] == s[i-1]:
            curr[j] = prev[j-1]
            # prev[j-1] = dp[i-1][j-1] — diagonal
    prev = curr  # curr (dp[i]) becomes prev (dp[i-1]) for next iteration

return prev[n]  # prev = dp[m], prev[n] = dp[m][n]`
      },
      {
        label: "2D String DP (Regex Matching)",
        hint: "'regular expression matching', 'c* matches zero or more c', '.' matches any char — harder than wildcard because * pairs with the char before it",
        code: `# dp[i][j] = True if s[:i] matches p[:j]
m, n = len(s), len(p)
dp = [[False] * (n + 1) for _ in range(m + 1)]
dp[0][0] = True  # empty matches empty

# patterns like a*, a*b*, a*b*c* can match empty string
for j in range(2, n + 1):
    if p[j-1] == '*':
        dp[0][j] = dp[0][j-2]  # 'x*' matches zero x's — skip two pattern chars
        #           ↑ two cells left

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if p[j-1] == '*':
            use_zero = dp[i][j-2]    # cell two left:  skip 'x*' entirely
            use_one  = dp[i-1][j] if (p[j-2] == '.' or p[j-2] == s[i-1]) else False
            #          ↑ row above:  'x*' matches one more char of s
            dp[i][j] = use_zero or use_one
        elif p[j-1] == '.' or p[j-1] == s[i-1]:
            dp[i][j] = dp[i-1][j-1]  # diagonal: both chars consumed

return dp[m][n]

# ─── Space Optimized: O(n) instead of O(m×n) ───────────────────────
# prev = the ROW ABOVE the one we're computing (dp[i-1])
# curr = the ROW WE ARE CURRENTLY COMPUTING    (dp[i])
# After each iteration: curr becomes the new prev for the next row

prev = [False] * (n + 1)  # prev = dp[0]
prev[0] = True             # dp[0][0] = True
for j in range(2, n + 1):
    if p[j-1] == '*':
        prev[j] = prev[j-2]  # dp[0][j] — 'x*' skips zero chars of empty s

for i in range(1, m + 1):
    curr = [False] * (n + 1)  # curr = dp[i], curr[0] = dp[i][0] = False
    for j in range(1, n + 1):
        if p[j-1] == '*':
            use_zero = curr[j-2] if j >= 2 else False
            # curr[j-2] = dp[i][j-2]  — two cells left (skip 'x*')
            use_one = prev[j] if (p[j-2] == '.' or p[j-2] == s[i-1]) else False
            # prev[j]   = dp[i-1][j]  — row above ('x*' matches one more)
            curr[j] = use_zero or use_one
        elif p[j-1] == '.' or p[j-1] == s[i-1]:
            curr[j] = prev[j-1]
            # prev[j-1] = dp[i-1][j-1] — diagonal
    prev = curr  # curr (dp[i]) becomes prev (dp[i-1]) for next iteration

return prev[n]  # prev = dp[m], prev[n] = dp[m][n]`
      },
      {
        label: "2D String DP (Edit Distance)",
        hint: "'minimum edit distance', 'min operations to convert s to t', 'insert/delete/replace' — dp[i][j] = min ops to convert s[:i] to t[:j]",
        code: `m, n = len(s), len(t)
# dp[i][j] = min operations to convert s[:i] into t[:j]
dp = [[0] * (n + 1) for _ in range(m + 1)]

# base cases: convert to/from empty string
for i in range(m + 1): dp[i][0] = i  # delete all chars of s
for j in range(n + 1): dp[0][j] = j  # insert all chars of t

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if s[i-1] == t[j-1]:
            dp[i][j] = dp[i-1][j-1]       # chars match — no operation needed
            #           ↑ diagonal: both chars consumed
        else:
            dp[i][j] = 1 + min(
                dp[i-1][j],    # delete from s   — move up in grid
                dp[i][j-1],    # insert into s   — move left in grid
                dp[i-1][j-1]   # replace         — move diagonally
            )

return dp[m][n]

# ─── Space Optimized: O(n) instead of O(m×n) ───────────────────────
# prev = the ROW ABOVE the one we're computing (dp[i-1])
# curr = the ROW WE ARE CURRENTLY COMPUTING    (dp[i])
# After each iteration: curr becomes the new prev for the next row

prev = list(range(n + 1))  # prev = dp[0] — base case: j insertions to make t[:j]

for i in range(1, m + 1):
    curr = [i] + [0] * n   # curr = dp[i] — curr[0] = dp[i][0] = i deletions
    for j in range(1, n + 1):
        if s[i-1] == t[j-1]:
            curr[j] = prev[j-1]           # equiv: dp[i-1][j-1] — diagonal
        else:
            curr[j] = 1 + min(
                prev[j],                  # equiv: dp[i-1][j]   — row above (delete)
                curr[j-1],                # equiv: dp[i][j-1]   — cell left (insert)
                prev[j-1]                 # equiv: dp[i-1][j-1] — diagonal (replace)
            )
    prev = curr  # curr (dp[i]) becomes prev (dp[i-1]) for next iteration

return prev[n]  # prev = dp[m], prev[n] = dp[m][n]`
      },
      {
        label: "2D String DP (Longest Common Subsequence)",
        hint: "'longest common subsequence', 'LCS', 'minimum deletions to make strings equal' — dp[i][j] = LCS length of s[:i] and t[:j]",
        code: `m, n = len(s), len(t)
# dp[i][j] = length of LCS of s[:i] and t[:j]
dp = [[0] * (n + 1) for _ in range(m + 1)]

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if s[i-1] == t[j-1]:
            dp[i][j] = dp[i-1][j-1] + 1   # chars match — extend LCS
            #           ↑ diagonal
        else:
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # skip either char, take best
            #                ↑ row above   ↑ cell left

return dp[m][n]

# ─── Space Optimized: O(n) instead of O(m×n) ───────────────────────
# prev = the ROW ABOVE the one we're computing (dp[i-1])
# curr = the ROW WE ARE CURRENTLY COMPUTING    (dp[i])
# After each iteration: curr becomes the new prev for the next row

prev = [0] * (n + 1)  # prev = dp[0] — base case: LCS with empty s is 0

for i in range(1, m + 1):
    curr = [0] * (n + 1)  # curr = dp[i]
    for j in range(1, n + 1):
        if s[i-1] == t[j-1]:
            curr[j] = prev[j-1] + 1       # equiv: dp[i-1][j-1] + 1 — diagonal
        else:
            curr[j] = max(prev[j], curr[j-1])
            # prev[j]   = dp[i-1][j]  — row above (skip char from s)
            # curr[j-1] = dp[i][j-1]  — cell left (skip char from t)
    prev = curr  # curr (dp[i]) becomes prev (dp[i-1]) for next iteration

return prev[n]  # prev = dp[m], prev[n] = dp[m][n]`
      }
    ],
    confusables: [
      {
        other: "Backtracking",
        similarity: "Both explore multiple decision paths",
        difference: "Backtracking generates every possible solution explicitly and is exponential time. DP stores results of subproblems to avoid recomputing them.",
        rule: "Problem asks for ALL solutions listed out → Backtracking. Count/min/max → DP. See the word 'combinations'? 'all combinations' → Backtracking, 'number of combinations' → DP. Hitting the same subproblem twice in recursion? → Add memoization = DP."
      },
      {
        other: "Greedy",
        similarity: "Both find an optimal solution",
        difference: "Greedy makes the locally best choice at each step without looking back. DP considers all possibilities and picks the globally best.",
        rule: "Can you prove a greedy choice always works? → Greedy (faster). Can you find a counterexample where greedy fails? → DP."
      }
    ]
  },
  {
    name: "Greedy",
    color: "#ff6b9d",
    keywords: ["minimum jumps", "meeting rooms", "task scheduler", "gas station", "interval scheduling", "activity selection", "minimum coins", "jump game", "candy", "partition labels", "minimum operations"],
    tells: [
      "Can make a locally optimal choice at each step without reconsidering",
      "Sorting the input first reveals the greedy order",
      "Problem involves intervals, scheduling, or coverage",
      "Greedy choice never needs to be undone",
      "Output type: ONE optimal answer — local choice is provably globally safe (linear time)",
      "If you can find a counterexample where local best fails → use DP instead",
      "Hierarchy: Backtracking = ALL solutions · DP = OPTIMAL (checks all subproblems) · Greedy = OPTIMAL (one pass, never backtracks)"
    ],
    example: "Jump Game, Meeting Rooms II, Task Scheduler, Gas Station, Candy",
    constraint: { label: "n ≤ 10^6 · O(n) or O(n log n)", color: "#f9ca24" },
    approach: [
      "Identify the greedy choice: what's the locally optimal decision at each step?",
      "Prove (or convince yourself) that the greedy choice never leads to a worse global outcome",
      "If unsure: try a counterexample. Can you find a case where greedy fails? If yes → use DP instead",
      "Sort the input if the greedy order isn't obvious (intervals by end time, tasks by frequency, etc.)",
      "Make the greedy choice at each step, commit to it, never look back",
      "For interval problems: sort by end time, pick intervals that end earliest",
      "For jump problems: track the farthest reachable index, update at each step"
    ],
    templates: [
      {
        label: "Jump Game (max reach)",
        hint: "'can you reach the end', 'minimum jumps to reach end' — track the farthest index reachable at each step",
        code: `# Greedy: at each position, update the farthest we can reach
# If we ever can't reach the current position, return False

max_reach = 0  # farthest index reachable so far

for i in range(len(nums)):
    if i > max_reach:
        return False    # can't reach this position — stuck
    max_reach = max(max_reach, i + nums[i])  # update farthest reach

return True  # made it to the end`
      },
      {
        label: "Task Scheduler",
        hint: "'task scheduler', 'minimum time to finish all tasks with cooldown' — most frequent task drives the minimum time",
        code: `from collections import Counter

count = Counter(tasks)
max_freq = max(count.values())  # most frequent task

# tasks with the same max frequency fill the last "chunk" together
max_freq_count = sum(1 for v in count.values() if v == max_freq)

# formula: either we need padding slots (idle time) or tasks fill naturally
min_time = max(
    len(tasks),                                           # no idle needed
    (max_freq - 1) * (n + 1) + max_freq_count            # idle needed
    # (max_freq - 1) full chunks + final partial chunk
)

return min_time`
      },
      {
        label: "Gas Station",
        hint: "'gas station circular route', 'can complete the circuit' — if total gas >= total cost a solution exists; greedy finds the start",
        code: `total = 0   # total gas surplus across all stations
tank  = 0   # current tank level
start = 0   # candidate starting station

for i in range(len(gas)):
    diff   = gas[i] - cost[i]  # net gain/loss at this station
    total += diff
    tank  += diff

    if tank < 0:
        # can't reach next station from current start — reset
        start = i + 1  # try starting from the next station
        tank  = 0      # reset tank for new candidate start

return start if total >= 0 else -1
# if total >= 0 a valid start exists — greedy guarantees start is correct`
      },
      {
        label: "Greedy on Sorted Input (Generic)",
        hint: "problem becomes obvious once sorted — 'non-overlapping intervals', 'partition labels', 'assign cookies'",
        code: `# Most greedy problems on arrays start with sorting
# Then make the locally optimal choice at each step

intervals.sort(key=lambda x: x[1])  # sort by end time (common for interval problems)

count = 0
end   = float('-inf')  # end of last selected interval

for start, finish in intervals:
    if start >= end:          # this interval doesn't overlap with last selected
        count += 1            # greedily select it
        end = finish          # update the boundary

return count`
      }
    ],
    confusables: [
      {
        other: "Dynamic Programming",
        similarity: "Both find a single optimal solution (min/max/count)",
        difference: "Greedy: one pass, one irreversible local choice per step, never looks back. DP: stores all subproblem results, considers every possibility. Both output ONE answer — Greedy is faster but only works when local optimal is provably global optimal.",
        rule: "Can you prove the greedy choice is always safe? → Greedy (linear). Can you find a counterexample where greedy fails? → DP (polynomial)."
      },
      {
        other: "Backtracking",
        similarity: "Both make sequential decisions",
        difference: "Backtracking outputs ALL valid solutions by trying every possibility and undoing bad choices. Greedy outputs ONE optimal solution by making irreversible choices. Completely different output types.",
        rule: "Need ALL solutions as a list? → Backtracking. Need ONE optimal answer? → Greedy or DP."
      }
    ]
  },
  {
    name: "Intervals",
    color: "#ff9f43",
    keywords: ["merge intervals", "insert interval", "meeting rooms", "non-overlapping", "overlapping intervals", "minimum rooms", "can attend", "erase intervals"],
    tells: [
      "Input is a list of [start, end] pairs",
      "Need to merge, count, or schedule intervals",
      "Sort by start time first — almost always",
      "Check if intervals overlap: start2 < end1"
    ],
    example: "Merge Intervals, Insert Interval, Meeting Rooms I & II, Non-overlapping Intervals",
    constraint: { label: "n ≤ 10^6 · O(n log n)", color: "#f9ca24" },
    approach: [
      "Sort intervals — almost always the first step. Sort by start time for merging/scheduling, by end time for greedy removal",
      "Two intervals [s1,e1] and [s2,e2] overlap if s2 <= e1 (after sorting by start)",
      "For merging: iterate and extend current interval's end if overlap, else start new interval",
      "For meeting rooms (min rooms): use a min-heap of end times. If earliest end <= new start → reuse room, else add room",
      "For non-overlapping removal: sort by END time, greedily keep intervals that end earliest",
      "For insert interval: add all intervals ending before new one, merge overlapping, add remaining",
      "Always draw out 2-3 examples on paper before coding interval problems"
    ],
    templates: [
      {
        label: "Merge Intervals",
        hint: "'merge all overlapping intervals', 'merge intervals' — sort by start, then greedily extend the current interval if it overlaps",
        code: `intervals.sort(key=lambda x: x[0])  # sort by start time

merged = [intervals[0]]  # start with first interval

for start, end in intervals[1:]:
    last_end = merged[-1][1]  # end of the last merged interval

    if start <= last_end:
        # overlaps — extend the current interval's end if needed
        merged[-1][1] = max(last_end, end)
    else:
        # no overlap — start a new interval
        merged.append([start, end])

return merged`
      },
      {
        label: "Insert Interval",
        hint: "'insert new interval and merge', 'add interval to sorted list' — add all non-overlapping before, merge overlapping, add rest",
        code: `result = []
i = 0
n = len(intervals)

# 1. Add all intervals that end before the new one starts (no overlap)
while i < n and intervals[i][1] < newInterval[0]:
    result.append(intervals[i])
    i += 1

# 2. Merge all overlapping intervals with newInterval
while i < n and intervals[i][0] <= newInterval[1]:
    newInterval[0] = min(newInterval[0], intervals[i][0])  # expand left if needed
    newInterval[1] = max(newInterval[1], intervals[i][1])  # expand right if needed
    i += 1
result.append(newInterval)  # add the fully merged interval

# 3. Add all remaining intervals (start after new one ends)
while i < n:
    result.append(intervals[i])
    i += 1

return result`
      },
      {
        label: "Insert Interval (One-Pass Single Loop)",
        hint: "same problem as above, but collapses all 3 phases into a single loop with early return — fewer lines, same correctness",
        code: `res = []

for i in range(len(intervals)):
    # Case 1: new interval ends before current starts — no overlap
    # new interval goes here, everything from i onward is untouched
    if newInterval[1] < intervals[i][0]:
        res.append(newInterval)
        return res + intervals[i:]   # early return — rest of list is unaffected

    # Case 2: current interval ends before new interval starts — no overlap
    # keep current interval as-is, move to next
    elif newInterval[0] > intervals[i][1]:
        res.append(intervals[i])

    # Case 3: overlap — merge by taking min start, max end
    # newInterval keeps growing as it absorbs more overlapping intervals
    else:
        newInterval = [min(newInterval[0], intervals[i][0]),
                       max(newInterval[1], intervals[i][1])]

# if we never hit the early return, the merged interval goes at the end
res.append(newInterval)
return res`
      },
      {
        label: "Meeting Rooms I (can attend all?)",
        hint: "'can one person attend all meetings', 'no overlap check' — just check if any two intervals overlap after sorting",
        code: `intervals.sort(key=lambda x: x[0])  # sort by start time

for i in range(1, len(intervals)):
    # if current start is before previous end — overlap!
    if intervals[i][0] < intervals[i-1][1]:
        return False  # conflict — can't attend all

return True  # no overlaps found`
      },
      {
        label: "Meeting Rooms II (min rooms needed)",
        hint: "'minimum conference rooms', 'minimum rooms required', 'how many people at peak' — use heap of end times to track rooms in use",
        code: `import heapq

intervals.sort(key=lambda x: x[0])  # sort by start time

heap = []  # min-heap of end times — each entry = one room currently occupied

for start, end in intervals:
    if heap and heap[0] <= start:
        # earliest-ending room is free by the time this meeting starts — reuse it
        heapq.heapreplace(heap, end)
    else:
        # no free room — open a new one
        heapq.heappush(heap, end)

return len(heap)  # total rooms open = minimum needed`
      },
      {
        label: "Non-overlapping Intervals (min removals)",
        hint: "'minimum number of intervals to remove', 'maximum non-overlapping intervals' — sort by end time, greedily keep intervals that end earliest",
        code: `intervals.sort(key=lambda x: x[1])  # sort by END time (not start!)
# sorting by end gives the greedy choice: keep whatever finishes earliest

count = 0          # number of intervals we keep
end   = float('-inf')  # end time of last kept interval

for start, finish in intervals:
    if start >= end:
        # no overlap with last kept — keep this one
        count += 1
        end = finish  # update boundary

# removals = total - kept
return len(intervals) - count`
      }
    ],
    confusables: [
      {
        other: "Greedy",
        similarity: "Interval problems almost always use a greedy strategy",
        difference: "Intervals is the data structure/problem type. Greedy is the technique used to solve it. Most interval problems ARE greedy problems — sort first, then make locally optimal choices.",
        rule: "Seeing [start, end] pairs → you're in Intervals territory. The solving approach inside will usually be greedy."
      },
      {
        other: "Two Pointers",
        similarity: "Both scan through a sorted list with index tracking",
        difference: "Two Pointers works on values in a flat array (find a pair). Interval problems work on [start, end] pairs where you're checking overlap relationships.",
        rule: "Input is [start, end] pairs → Intervals. Input is a flat array of values → Two Pointers."
      }
    ]
  },
  {
    name: "Stack",
    color: "#e17055",
    keywords: ["parentheses", "brackets", "valid expression", "nested structure", "undo operations", "matching pairs", "balanced", "decode string", "evaluate expression"],
    tells: [
      "Need to match opening and closing pairs",
      "Nested structures where inner must resolve before outer",
      "Undo/redo operations or 'last in first out' logic",
      "Evaluating expressions with operators and operands"
    ],
    example: "Valid Parentheses, Decode String, Basic Calculator, Min Stack",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Initialize an empty stack",
      "Iterate through the input character by character (or element by element)",
      "For matching pairs: push opening brackets, pop and verify on closing brackets",
      "For nested structures: push current context onto stack when entering a nesting level, pop and combine when exiting",
      "For expression evaluation: push numbers/operators, apply operators when precedence allows",
      "If stack is empty when trying to pop → invalid input (return False or handle error)",
      "At the end: stack should be empty for valid balanced structures"
    ],
    templates: [
      {
        label: "Valid Parentheses / Matching Pairs",
        hint: "'valid parentheses', 'balanced brackets', 'matching pairs' — push open brackets, pop and check on close",
        code: `stack = []
mapping = {')': '(', '}': '{', ']': '['}

for char in s:
    if char in '({[':
        stack.append(char)        # push any opening bracket
    elif char in ')}]':
        if not stack or stack[-1] != mapping[char]:
            return False          # no matching open bracket — invalid
        stack.pop()               # matched — pop the open bracket

return len(stack) == 0  # valid only if all brackets were matched`
      },
      {
        label: "Decode String / Nested Structure",
        hint: "'decode string', 'nested encoding', 'evaluate nested expressions' — stack unwinds inner results before combining with outer",
        code: `stack = []
curr_str = ""
curr_num = 0

for char in s:
    if char.isdigit():
        curr_num = curr_num * 10 + int(char)  # build multi-digit numbers
    elif char == '[':
        stack.append((curr_str, curr_num))    # save outer context
        curr_str = ""                          # reset for inner expression
        curr_num = 0
    elif char == ']':
        prev_str, num = stack.pop()            # restore outer context
        curr_str = prev_str + num * curr_str   # repeat inner, append to outer
    else:
        curr_str += char

return curr_str`
      },
      {
        label: "Min Stack (track min at each state)",
        hint: "'min stack', 'get minimum in O(1)', 'stack that supports getMin' — store (value, current_min) pairs so min is always known",
        code: `stack = []  # stores (value, min_so_far) pairs

def push(val):
    curr_min = min(val, stack[-1][1] if stack else val)
    stack.append((val, curr_min))
    # each entry remembers the minimum at the time it was pushed

def pop():
    stack.pop()

def top():
    return stack[-1][0]

def getMin():
    return stack[-1][1]  # O(1) — min is stored with every entry`
      }
    ],
    confusables: [
      {
        other: "Monotonic Stack",
        similarity: "Both use a stack data structure",
        difference: "Plain stack is for matching pairs, nested structures, or tracking state. Monotonic stack specifically maintains a sorted order to find next greater/smaller elements.",
        rule: "Matching brackets or nested structure → Stack. Finding next greater/smaller for each element → Monotonic Stack."
      },
      {
        other: "Backtracking",
        similarity: "Both handle nested or recursive-feeling problems",
        difference: "Stack iteratively processes characters/elements using explicit push/pop. Backtracking recursively explores all possible paths with undo.",
        rule: "Processing a string or expression character by character → Stack. Generating all possible combinations or paths → Backtracking."
      }
    ]
  },
  {
    name: "Linked List",
    color: "#a29bfe",
    keywords: ["linked list", "fast slow pointer", "cycle detection", "middle of list", "reverse linked list", "merge lists", "nth from end", "palindrome list"],
    tells: [
      "Input is explicitly a linked list (node.next)",
      "Need to find the middle or a cycle",
      "Two pointers moving at different speeds",
      "In-place reversal or merging of nodes"
    ],
    example: "Linked List Cycle, Find Middle, Reverse Linked List, Merge Two Sorted Lists",
    constraint: { label: "n ≤ 10^6 · O(n)", color: "#f9ca24" },
    approach: [
      "Use a dummy node at the head to avoid edge cases when the head itself might change",
      "For cycle detection / middle: use fast (2 steps) and slow (1 step) pointers",
      "For reversal: use 3 pointers — prev, curr, next_node. Save next before overwriting curr.next",
      "For nth from end: move fast pointer n steps ahead first, then move both until fast reaches end",
      "For merging: compare heads of both lists, attach the smaller one, advance that pointer",
      "Always draw the pointer manipulation on paper before coding — linked list bugs are almost always pointer order issues",
      "After a reversal or merge, double check what dummy.next points to before returning"
    ],
    templates: [
      {
        label: "Fast / Slow Pointers (Floyd's)",
        hint: "'cycle detection', 'find middle of linked list', 'linked list cycle' — slow moves 1 step, fast moves 2, they meet if cycle exists",
        code: `slow = head
fast = head

while fast and fast.next:
    slow = slow.next        # moves 1 step
    fast = fast.next.next   # moves 2 steps
    if slow == fast:
        return True  # cycle detected — they met inside the loop

return False  # fast reached end — no cycle

# To find MIDDLE: when fast reaches end, slow is at middle
# slow = head, fast = head
# while fast and fast.next: slow = slow.next; fast = fast.next.next
# return slow  ← middle node`
      },
      {
        label: "Reverse Linked List",
        hint: "'reverse linked list', 'reverse a portion of list' — iteratively reassign next pointers using three pointers",
        code: `prev = None
curr = head

while curr:
    next_node = curr.next   # save next before overwriting
    curr.next = prev        # reverse the pointer
    prev = curr             # advance prev
    curr = next_node        # advance curr

return prev  # prev is now the new head`
      },
      {
        label: "Dummy Node (Merge / Delete)",
        hint: "'merge two sorted lists', 'delete nth from end', 'remove duplicates from list' — dummy node avoids edge cases on the head",
        code: `dummy = ListNode(0)   # dummy node before the real head
dummy.next = head     # avoids special-casing when head itself changes
curr = dummy

# Merge two sorted lists
while l1 and l2:
    if l1.val <= l2.val:
        curr.next = l1
        l1 = l1.next
    else:
        curr.next = l2
        l2 = l2.next
    curr = curr.next

curr.next = l1 or l2  # attach remaining list

return dummy.next  # skip dummy to get real head`
      },
      {
        label: "Nth From End (Two Pointer Gap)",
        hint: "'remove nth node from end', 'kth from end' — move fast pointer n steps ahead, then move both until fast hits end",
        code: `dummy = ListNode(0)
dummy.next = head
fast = dummy
slow = dummy

# Move fast n+1 steps ahead to create a gap of n between fast and slow
for _ in range(n + 1):
    fast = fast.next

# Move both until fast reaches the end
while fast:
    fast = fast.next
    slow = slow.next

# slow is now just before the node to delete
slow.next = slow.next.next  # skip the nth node from end

return dummy.next`
      }
    ],
    confusables: [
      {
        other: "Two Pointers",
        similarity: "Both use two pointer variables moving through a structure",
        difference: "Array two pointers move by index on random-access arrays. Linked list pointers follow .next — no random access, different speeds (fast/slow) are needed for cycle/middle detection.",
        rule: "Input is an array → Two Pointers by index. Input is a linked list → Fast/Slow pointer or dummy node techniques."
      },
      {
        other: "DFS (Graph/Matrix)",
        similarity: "Both traverse a connected structure",
        difference: "Linked lists are linear — each node has at most one next pointer. Graphs have multiple neighbors per node. Linked list traversal is always a simple while loop, not recursive DFS.",
        rule: "Each node has one next pointer (linked list) → iterative while loop. Each node has multiple neighbors (graph/tree) → DFS/BFS."
      }
    ]
  },
  {
    name: "Math",
    color: "#fd79a8",
    keywords: ["without extra space", "O(1) space", "power of x", "square root", "GCD", "LCM", "prime", "digit", "reverse integer", "overflow", "coordinate", "missing number", "happy number", "excel column"],
    tells: [
      "Constraint says O(1) space or no extra data structures",
      "Involves digits, remainders, or modular arithmetic",
      "Geometry: coordinates, areas, angles",
      "Number theory: GCD, prime, power",
      "Cycle detection via math (Happy Number, Floyd's)"
    ],
    example: "Happy Number, Missing Number, Pow(x,n), Reverse Integer, Excel Sheet Column",
    constraint: { label: "n ≥ 10^7 · O(1) or O(log n)", color: "#FC5C65" },
    approach: [
      "Check if a closed-form formula exists: sum formula n*(n+1)/2, GCD, modular arithmetic",
      "For digit problems: use divmod(n, 10) to extract digits one at a time",
      "For cycle detection (Happy Number): use fast/slow pointers on the sequence",
      "For fast exponentiation: halve the exponent each step (square the base when even, multiply result when odd)",
      "For overflow: check against INT_MAX/INT_MIN before returning, use Python's arbitrary precision integers",
      "For missing number: expected_sum - actual_sum OR XOR all indices and values",
      "If O(1) space required and you're reaching for a set/map → there's probably a math trick"
    ],
    templates: [
      {
        label: "Fast and Slow (Cycle Detection for Math)",
        hint: "'happy number', 'detect cycle in sequence' — if a sequence loops, slow and fast pointers will meet",
        code: `def isHappy(n):
    def get_next(n):
        total = 0
        while n > 0:
            n, digit = divmod(n, 10)  # split off last digit
            total += digit ** 2       # sum of squares of digits
        return total

    slow = n
    fast = get_next(n)  # fast moves 2 steps at a time

    while fast != 1 and slow != fast:
        slow = get_next(slow)            # 1 step
        fast = get_next(get_next(fast))  # 2 steps

    return fast == 1  # reached 1 = happy, else cycle detected`
      },
      {
        label: "Pow(x, n) — Fast Exponentiation",
        hint: "'implement pow', 'x to the power n', 'fast power' — halve the exponent each step, O(log n)",
        code: `def myPow(x, n):
    if n < 0:
        x = 1 / x   # negative exponent = reciprocal
        n = -n

    result = 1
    while n > 0:
        if n % 2 == 1:       # odd exponent — multiply result by x
            result *= x
        x *= x               # square the base
        n //= 2              # halve the exponent each step → O(log n)
        # e.g. x^8 = (x^2)^4 = ((x^2)^2)^2 — only 3 multiplications

    return result`
      },
      {
        label: "GCD / LCM",
        hint: "'greatest common divisor', 'least common multiple', 'simplify fraction' — Euclidean algorithm",
        code: `def gcd(a, b):
    while b:
        a, b = b, a % b  # remainder replaces larger number
        # gcd(a, b) = gcd(b, a % b) — Euclidean algorithm
    return a

def lcm(a, b):
    return a * b // gcd(a, b)  # LCM = product / GCD`
      },
      {
        label: "Missing Number / Math Trick",
        hint: "'find missing number in range 0 to n', 'O(1) space' — use sum formula or XOR instead of a set",
        code: `def missingNumber(nums):
    n = len(nums)

    # Math approach: expected sum minus actual sum = missing number
    expected = n * (n + 1) // 2  # sum of 0..n
    return expected - sum(nums)

    # XOR approach: every number XORed with itself = 0
    # XOR all indices AND all values → duplicates cancel out, missing remains
    # result = 0
    # for i, num in enumerate(nums):
    #     result ^= i ^ num
    # return result ^ n`
      }
    ],
    confusables: [
      {
        other: "Binary Search",
        similarity: "Both can solve problems on sorted ranges in O(log n)",
        difference: "Binary Search finds a target by eliminating half the range each step. Math tricks derive the answer directly from a formula without searching.",
        rule: "Can you compute the answer with a formula (sum, GCD, modulo)? → Math. Need to search a range? → Binary Search."
      },
      {
        other: "HashMap",
        similarity: "Both can find missing or duplicate numbers",
        difference: "HashMap uses O(n) space to store seen values. Math tricks use O(1) space by exploiting numeric properties like sum formulas or XOR.",
        rule: "Constraint says O(1) space or no extra data structures → Math trick. Space not a concern → HashMap is simpler."
      }
    ]
  },
  {
    name: "Bit Manipulation",
    color: "#55efc4",
    keywords: ["XOR", "single number", "power of 2", "bit", "AND", "OR", "shift", "missing number", "count bits", "subsets using bits", "hamming distance"],
    tells: [
      "Problem involves XOR — 'find the one number that appears once'",
      "'Is this a power of 2?' → n & (n-1) == 0",
      "Count set bits / Hamming distance",
      "Generate all subsets using bitmask",
      "Constraint says O(1) space and O(n) time for a 'find unique' problem"
    ],
    example: "Single Number, Power of Two, Counting Bits, Missing Number, Subsets via Bitmask",
    constraint: { label: "n ≤ 10^6 · O(n) or O(1)", color: "#f9ca24" },
    approach: [
      "Identify which core trick applies: XOR cancellation, power of 2 check, bit counting, bitmask, or shifts",
      "For 'find single/unique element among duplicates' → XOR all elements (duplicates cancel to 0)",
      "For 'is power of 2' → check n & (n-1) == 0",
      "For 'count set bits' → loop: n &= (n-1) removes lowest set bit each iteration, count iterations",
      "For 'generate all subsets' with n ≤ 20 → iterate mask from 0 to 2^n, check each bit",
      "For arithmetic without operators → use left/right shifts for multiply/divide by 2",
      "When stuck: write out the binary representation of your example numbers — the pattern usually becomes obvious"
    ],
    templates: [
      {
        label: "XOR Trick (find unique number)",
        hint: "'single number', 'find the element that appears once while others appear twice' — XOR cancels pairs",
        code: `def singleNumber(nums):
    result = 0
    for num in nums:
        result ^= num  # XOR with each number
        # Key property: a ^ a = 0  (same number cancels itself)
        #               a ^ 0 = a  (XOR with 0 keeps the value)
        # So all duplicates cancel out, only the unique number remains

    return result

# Works for: single number among pairs, missing number, find two unique numbers`
      },
      {
        label: "Power of 2 Check",
        hint: "'is power of 2', 'is n a power of 2' — power of 2 has exactly one bit set",
        code: `def isPowerOfTwo(n):
    if n <= 0: return False
    return n & (n - 1) == 0
    # Powers of 2 in binary: 1, 10, 100, 1000...
    # n-1 flips all bits after the single set bit: 0111...
    # n & (n-1) clears the lowest set bit
    # If result is 0, only one bit was set → power of 2

# Same trick: count set bits
# n & (n-1) removes the lowest set bit each iteration
def countBits(n):
    count = 0
    while n:
        n &= (n - 1)  # remove lowest set bit
        count += 1
    return count`
      },
      {
        label: "Bitmask Subsets",
        hint: "'generate all subsets', 'enumerate all combinations using bits' — each bit represents include/exclude",
        code: `def subsets(nums):
    n = len(nums)
    result = []

    for mask in range(1 << n):  # 1 << n = 2^n, iterate all bitmasks
        subset = []
        for i in range(n):
            if mask & (1 << i):  # check if bit i is set
                subset.append(nums[i])  # include nums[i] in this subset
        result.append(subset)
        # Each mask is a binary number where bit i = include nums[i]
        # mask=0b101 means include nums[0] and nums[2]

    return result`
      },
      {
        label: "Bit Shift Operations",
        hint: "'multiply/divide by 2', 'divide two integers without operators', 'mid without overflow'",
        code: `# Left shift = multiply by 2
x << 1   # x * 2
x << 2   # x * 4

# Right shift = divide by 2 (floor)
x >> 1   # x // 2
x >> 2   # x // 4

# Safe midpoint (avoids integer overflow vs (lo+hi)//2)
mid = lo + ((hi - lo) >> 1)
# equivalent to (lo + hi) // 2 but safe for large numbers

# Check if bit i is set
(n >> i) & 1  # 1 if bit i is set, 0 otherwise

# Set bit i
n | (1 << i)

# Clear bit i
n & ~(1 << i)`
      }
    ],
    confusables: [
      {
        other: "Math",
        similarity: "Both solve problems in O(1) space using numeric properties",
        difference: "Math uses arithmetic formulas (sum, GCD, modulo). Bit Manipulation uses binary representation and bitwise operators (XOR, AND, shift).",
        rule: "Problem mentions XOR, bits, power of 2, or binary representation → Bit Manipulation. Problem involves formulas, remainders, or number theory → Math."
      },
      {
        other: "HashMap",
        similarity: "Both can find single/missing/duplicate numbers",
        difference: "HashMap stores counts explicitly in O(n) space. XOR trick finds the unique element in O(1) space by exploiting the property that duplicates cancel.",
        rule: "Need to find the ONE element that appears odd times, O(1) space → XOR. Need to count frequencies or find multiple missing → HashMap."
      }
    ]
  },
  {
    name: "Prefix Sum",
    color: "#fdcb6e",
    keywords: ["subarray sum", "range sum", "sum between indices", "running total", "cumulative sum", "number of subarrays with sum k", "pivot index", "product except self", "range query"],
    tells: [
      "Need the sum of a subarray from index i to j repeatedly",
      "Multiple range queries on the same array",
      "'Number of subarrays with sum equal to k' — combine prefix sum with a hashmap",
      "2D grid sum queries — 2D prefix sum",
      "Product of array except self — use prefix product and suffix product"
    ],
    example: "Range Sum Query, Subarray Sum Equals K, Product of Array Except Self, Pivot Index",
    constraint: { label: "n ≤ 10^6 · O(n) precompute, O(1) query", color: "#f9ca24" },
    approach: [
      "Build prefix array: prefix[0] = 0, prefix[i] = prefix[i-1] + nums[i-1]",
      "Range sum nums[i..j] (inclusive) = prefix[j+1] - prefix[i] in O(1)",
      "For 'number of subarrays with sum k': use a hashmap of {prefix_sum: count}, check if (current_sum - k) exists",
      "For Product Except Self: build prefix products left-to-right, suffix products right-to-left, multiply them",
      "For 2D prefix sum: prefix[r][c] = prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1] + grid[r][c]",
      "Off-by-one is common — use 1-indexed prefix array (size n+1) with prefix[0]=0 to simplify range queries"
    ],
    templates: [
      {
        label: "1D Range Sum Query",
        hint: "'range sum query', 'sum between indices i and j', multiple sum queries on same array",
        code: `# Build prefix sum array — O(n) once, then each query is O(1)
# prefix[i] = sum of nums[0..i-1]  (1-indexed, prefix[0] = 0)

n = len(nums)
prefix = [0] * (n + 1)  # size n+1 so prefix[0] = 0 (empty prefix)

for i in range(n):
    prefix[i + 1] = prefix[i] + nums[i]
    # prefix[i+1] = sum of nums[0..i]

# Range sum query: sum of nums[i..j] inclusive
def range_sum(i, j):
    return prefix[j + 1] - prefix[i]
    # prefix[j+1] = sum of nums[0..j]
    # prefix[i]   = sum of nums[0..i-1]
    # difference  = sum of nums[i..j]`
      },
      {
        label: "Subarray Sum Equals K (Prefix + HashMap)",
        hint: "'number of subarrays with sum equal to k', 'count subarrays with target sum' — prefix sum + hashmap to find complement",
        code: `from collections import defaultdict

def subarraySum(nums, k):
    count = 0
    curr_sum = 0
    seen = defaultdict(int)
    seen[0] = 1  # empty prefix has sum 0 — one way to have sum 0 before we start

    for num in nums:
        curr_sum += num  # running prefix sum

        # if (curr_sum - k) was seen before, those subarrays ending here have sum k
        # because: curr_sum - prev_sum = k → subarray between prev and current = k
        count += seen[curr_sum - k]

        seen[curr_sum] += 1  # record this prefix sum for future lookups

    return count`
      },
      {
        label: "Product of Array Except Self",
        hint: "'product of array except self', 'no division allowed' — prefix product from left + suffix product from right",
        code: `def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n

    # Pass 1: prefix products — result[i] = product of all nums to the LEFT of i
    prefix = 1
    for i in range(n):
        result[i] = prefix       # everything to the left of i
        prefix *= nums[i]        # include nums[i] for the next position

    # Pass 2: suffix products — multiply in product of everything to the RIGHT
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix      # result[i] now = left product * right product
        suffix *= nums[i]        # include nums[i] for the next position (going left)

    return result`
      },
      {
        label: "2D Prefix Sum (Grid Range Query)",
        hint: "'sum of rectangle subgrid', 'range sum in 2D matrix', multiple sum queries on a grid",
        code: `# Build 2D prefix sum — O(m*n) once, each query O(1)
# prefix[r][c] = sum of rectangle from (0,0) to (r-1, c-1)

m, n = len(grid), len(grid[0])
prefix = [[0] * (n + 1) for _ in range(m + 1)]

for r in range(1, m + 1):
    for c in range(1, n + 1):
        prefix[r][c] = (grid[r-1][c-1]
                       + prefix[r-1][c]    # sum above
                       + prefix[r][c-1]    # sum to left
                       - prefix[r-1][c-1]) # subtract overlap (counted twice)

# Query: sum of rectangle (r1,c1) to (r2,c2) inclusive
def query(r1, c1, r2, c2):
    return (prefix[r2+1][c2+1]
           - prefix[r1][c2+1]    # remove rows above
           - prefix[r2+1][c1]    # remove cols to left
           + prefix[r1][c1])     # add back overlap (subtracted twice)`
      }
    ],
    confusables: [
      {
        other: "Sliding Window",
        similarity: "Both deal with subarray sums",
        difference: "Sliding Window computes the sum dynamically as the window moves and works when the condition lets you shrink/expand. Prefix Sum precomputes all sums upfront for O(1) arbitrary range queries.",
        rule: "Need the sum of any arbitrary range [i,j] repeatedly → Prefix Sum. Need the longest/shortest contiguous subarray satisfying a condition → Sliding Window."
      },
      {
        other: "HashMap",
        similarity: "Both are used in 'number of subarrays with sum k'",
        difference: "For subarray sum problems you actually need BOTH — prefix sum gives you the running total and HashMap lets you look up whether (current_sum - k) was seen before in O(1).",
        rule: "Subarray sum equals k → Prefix Sum + HashMap together. Pure frequency/existence lookup → HashMap alone."
      }
    ]
  }
];


const inputTypes = [
  {
    type: "Array",
    icon: "[ ]",
    color: "#4ECDC4",
    routes: [
      { condition: "sorted + find pair/sum", pattern: "Two Pointers" },
      { condition: "sorted + find value/position", pattern: "Binary Search" },
      { condition: "contiguous subarray/substring", pattern: "Sliding Window" },
      { condition: "top k / kth largest", pattern: "Top K Elements / Heap" },
      { condition: "next greater/smaller for each", pattern: "Monotonic Stack" },
      { condition: "max/min/count ways (optimal)", pattern: "Dynamic Programming" },
      { condition: "all combinations/permutations", pattern: "Backtracking" },
      { condition: "intervals [start, end]", pattern: "Intervals" },
      { condition: "sum of any subarray range [i,j] repeatedly", pattern: "Prefix Sum" },
    ]
  },
  {
    type: "String",
    icon: '" "',
    color: "#FF6B6B",
    routes: [
      { condition: "palindrome / reverse / remove chars", pattern: "Two Pointers" },
      { condition: "longest/shortest substring with condition", pattern: "Sliding Window" },
      { condition: "anagram / frequency / duplicates", pattern: "HashMap" },
      { condition: "parentheses / nested / decode", pattern: "Stack" },
      { condition: "edit distance / regex / wildcard / subsequences", pattern: "Dynamic Programming" },
      { condition: "all permutations of characters", pattern: "Backtracking" },
    ]
  },
  {
    type: "Tree",
    icon: "🌲",
    color: "#26de81",
    routes: [
      { condition: "level order / by depth / row", pattern: "BFS (Graph/Matrix)" },
      { condition: "path root to leaf / visit all nodes", pattern: "DFS (Binary Trees)" },
      { condition: "diameter / height / combine left+right", pattern: "DFS with Return Value (Trees)" },
      { condition: "BST sorted order / validate / search", pattern: "BST Patterns" },
      { condition: "median of stream in BST", pattern: "Two Heaps" },
    ]
  },
  {
    type: "Graph",
    icon: "◉—◉",
    color: "#8854d0",
    routes: [
      { condition: "shortest path / minimum steps", pattern: "BFS (Graph/Matrix)" },
      { condition: "connected components / flood fill", pattern: "DFS (Graph/Matrix)" },
      { condition: "dependencies / task ordering", pattern: "Graph / Adjacency List" },
      { condition: "connected groups / cycle detection", pattern: "Union Find (DSU)" },
    ]
  },
  {
    type: "2D Grid",
    icon: "⊞",
    color: "#f9ca24",
    routes: [
      { condition: "shortest path in grid", pattern: "BFS (Graph/Matrix)" },
      { condition: "islands / regions / flood fill", pattern: "DFS (Graph/Matrix)" },
      { condition: "cells added dynamically / after each operation", pattern: "Union Find (DSU)" },
      { condition: "word search / path exists", pattern: "Backtracking" },
      { condition: "path count / min cost path", pattern: "Dynamic Programming" },
    ]
  },
  {
    type: "Linked List",
    icon: "◉→◉",
    color: "#a29bfe",
    routes: [
      { condition: "cycle / middle of list", pattern: "Linked List" },
      { condition: "reverse / merge / delete node", pattern: "Linked List" },
      { condition: "nth from end", pattern: "Linked List" },
    ]
  },
  {
    type: "Sorted Array",
    icon: "↑[ ]",
    color: "#45B7D1",
    routes: [
      { condition: "find target value", pattern: "Binary Search" },
      { condition: "find pair that sums to X", pattern: "Two Pointers" },
      { condition: "merge / combine sorted arrays", pattern: "Two Pointers" },
      { condition: "kth smallest/largest", pattern: "Top K Elements / Heap" },
    ]
  },
  {
    type: "Output: List of Lists",
    icon: "[[]]",
    color: "#fd9644",
    routes: [
      { condition: "all combinations / subsets / permutations", pattern: "Backtracking" },
      { condition: "all paths in graph/grid", pattern: "Backtracking" },
    ]
  },
  {
    type: "Output: Single Number",
    icon: "42",
    color: "#eb3b5a",
    routes: [
      { condition: "max/min/count with complex decisions", pattern: "Dynamic Programming" },
      { condition: "locally optimal at each step", pattern: "Greedy" },
      { condition: "search in sorted range", pattern: "Binary Search" },
      { condition: "top k element", pattern: "Top K Elements / Heap" },
      { condition: "formula / digit / modulo / O(1) space", pattern: "Math" },
      { condition: "XOR / bits / power of 2", pattern: "Bit Manipulation" },
    ]
  },
];

const patternGroups = [
  { label: "Arrays", patterns: ["Two Pointers", "Sliding Window", "Binary Search", "Monotonic Stack", "HashMap", "Prefix Sum"] },
  { label: "Heaps", patterns: ["Top K Elements / Heap", "Two Heaps"] },
  { label: "Trees", patterns: ["DFS (Binary Trees)", "DFS with Return Value (Trees)", "BST Patterns", "BFS (Graph/Matrix)"] },
  { label: "Graphs", patterns: ["DFS (Graph/Matrix)", "Graph / Adjacency List", "Union Find (DSU)"] },
  { label: "Backtracking & DP", patterns: ["Backtracking", "Dynamic Programming", "Greedy", "Intervals"] },
  { label: "Data Structures", patterns: ["Stack", "Linked List"] },
  { label: "Math & Bits", patterns: ["Math", "Bit Manipulation"] },
];

export default function DSAPatterns() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("keywords");
  const [templateIdx, setTemplateIdx] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [showConstraints, setShowConstraints] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 700
  );
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined" && window.innerWidth > window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = patterns.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.keywords.some(k => k.toLowerCase().includes(q)) ||
      p.tells.some(t => t.toLowerCase().includes(q)) ||
      p.example.toLowerCase().includes(q) ||
      p.templates.some(t =>
        t.label.toLowerCase().includes(q) ||
        (t.hint && t.hint.toLowerCase().includes(q))
      )
    );
  });

  const p = selected;

  const selectPattern = (pat) => {
    setSelected(pat);
    setTemplateIdx(0);
    setTab("keywords");
    setShowDetail(true);
  };

  const detailPanel = p ? (
    <div>
      {/* Pattern header */}
      <div style={{
        background: "#111",
        border: `1px solid ${p.color}22`,
        borderRadius: 10,
        padding: "20px 24px",
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>{p.name}</h2>
          {/* Constraint badge */}
          {p.constraint && (
            <span style={{
              background: `${p.constraint.color}18`,
              border: `1px solid ${p.constraint.color}44`,
              color: p.constraint.color,
              padding: "2px 10px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
            }}>{p.constraint.label}</span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#555" }}>e.g. {p.example}</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {["keywords", "tells", "approach", "input", "vs", "template"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 14px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
              background: tab === t ? p.color : "#1a1a1a",
              color: tab === t ? "#000" : "#666",
              transition: "all 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Keywords */}
      {tab === "keywords" && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Words that signal this pattern
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {p.keywords.map(k => (
              <span key={k} style={{
                background: `${p.color}18`,
                border: `1px solid ${p.color}44`,
                color: p.color,
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 15,
                fontWeight: 500,
              }}>
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tells */}
      {tab === "tells" && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            When to use this pattern
          </div>
          {p.tells.map((t, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "12px 0",
              borderBottom: i < p.tells.length - 1 ? "1px solid #1a1a1a" : "none",
            }}>
              <span style={{ color: p.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* Approach */}
      {tab === "approach" && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #1e1e1e", fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>
            Step-by-step approach
          </div>
          {(p.approach || ["No approach steps defined yet."]).map((step, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              padding: "14px 20px",
              borderBottom: i < (p.approach || []).length - 1 ? "1px solid #1a1a1a" : "none",
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `${p.color}22`,
                border: `1px solid ${p.color}55`,
                color: p.color,
                fontWeight: 700,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, paddingTop: 4 }}>{step}</div>
            </div>
          ))}
        </div>
      )}

      {/* Input Types */}
      {tab === "input" && (() => {
        const matches = inputTypes.filter(it =>
          it.routes.some(r => r.pattern === p.name)
        );
        return (
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #1e1e1e", fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>
              Which input types lead to this pattern
            </div>
            {matches.length === 0 ? (
              <div style={{ padding: 24, color: "#444", fontSize: 13 }}>No input type mappings found for this pattern.</div>
            ) : (
              matches.map((it, idx) => {
                const relevantRoutes = it.routes.filter(r => r.pattern === p.name);
                return (
                  <div key={it.type} style={{
                    borderBottom: idx < matches.length - 1 ? "1px solid #1a1a1a" : "none",
                  }}>
                    {/* Input type header */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 18px 8px",
                      background: `${it.color}0d`,
                    }}>
                      <span style={{ fontFamily: "monospace", fontSize: 13, color: it.color, fontWeight: 700 }}>{it.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: it.color }}>{it.type}</span>
                    </div>
                    {/* Conditions that route here */}
                    {relevantRoutes.map((r, i) => (
                      <div key={i} style={{
                        padding: "8px 18px 8px 40px",
                        borderTop: "1px solid #111",
                        fontSize: 14,
                        color: "#aaa",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}>
                        <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span><span style={{ color: "#555" }}>when </span>{r.condition}</span>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        );
      })()}

      {/* VS */}
      {tab === "vs" && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Commonly confused with
          </div>
          {p.confusables.map((c, i) => {
            const otherPattern = patterns.find(x => x.name === c.other);
            return (
              <div key={i} style={{
                padding: "16px 0",
                borderBottom: i < p.confusables.length - 1 ? "1px solid #1a1a1a" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: "#444" }}>vs</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: otherPattern?.color || "#aaa",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textDecorationStyle: "dotted",
                  }}
                    onClick={() => { selectPattern(otherPattern); setTab("vs"); }}
                  >{c.other}</span>
                </div>
                <div style={{ background: "#0d0d0d", borderRadius: 6, padding: "10px 14px", marginBottom: 8, borderLeft: "2px solid #2a2a2a" }}>
                  <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Why they're similar: </span>
                  <span style={{ fontSize: 13, color: "#888" }}>{c.similarity}</span>
                </div>
                <div style={{ background: "#0d0d0d", borderRadius: 6, padding: "10px 14px", marginBottom: 8, borderLeft: `2px solid ${p.color}66` }}>
                  <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>How to tell them apart: </span>
                  <span style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{c.difference}</span>
                </div>
                <div style={{ background: `${p.color}10`, border: `1px solid ${p.color}33`, borderRadius: 6, padding: "10px 14px" }}>
                  <span style={{ fontSize: 11, color: p.color, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>⚡ Rule: </span>
                  <span style={{ fontSize: 13, color: "#e0e0e0", lineHeight: 1.6 }}>{c.rule}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Template */}
      {tab === "template" && (
        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: "#111", borderBottom: "1px solid #1e1e1e", padding: "10px 18px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.templates.map((t, i) => (
              <button
                key={i}
                onClick={() => setTemplateIdx(i)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 5,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  background: templateIdx === i ? p.color : "#1e1e1e",
                  color: templateIdx === i ? "#000" : "#666",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {p.templates[templateIdx]?.hint && (
            <div style={{ padding: "10px 18px", background: "#0f0f0f", borderBottom: "1px solid #1e1e1e", fontSize: 12, color: "#888" }}>
              <span style={{ color: p.color, fontWeight: 700 }}>🔍 Use when: </span>
              {p.templates[templateIdx].hint}
            </div>
          )}
          <pre style={{
            margin: 0,
            padding: 20,
            fontSize: isMobile ? 11 : 13,
            lineHeight: 1.8,
            color: "#b0c4de",
            overflowX: "auto",
            whiteSpace: "pre",
          }}>
            {p.templates[templateIdx]?.code}
          </pre>
        </div>
      )}
    </div>
  ) : (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 40, textAlign: "center", color: "#333" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>←</div>
      <div style={{ fontSize: 14 }}>select a pattern to see keywords, tells, and template</div>
    </div>
  );

  const listPanel = (
    <div>
      <div style={{ fontSize: 12, color: "#444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
        {filtered.length} patterns
      </div>
      {search ? (
        // When searching, show flat list
        filtered.map(pat => (
          <div
            key={pat.name}
            onClick={() => selectPattern(pat)}
            style={{
              padding: "10px 14px",
              marginBottom: 4,
              borderRadius: 6,
              cursor: "pointer",
              background: selected?.name === pat.name ? "#1a1a1a" : "transparent",
              borderLeft: selected?.name === pat.name ? `3px solid ${pat.color}` : "3px solid transparent",
              transition: "all 0.1s",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, color: selected?.name === pat.name ? pat.color : "#ccc" }}>
              {pat.name}
            </div>
            {/* Show the matching keyword/tell/hint that caused this result */}
            {(() => {
              const q = search.toLowerCase();
              const matchedKw = pat.keywords.find(k => k.toLowerCase().includes(q));
              const matchedTell = !matchedKw && pat.tells.find(t => t.toLowerCase().includes(q));
              const matchedHint = !matchedKw && !matchedTell && pat.templates.find(t => t.hint && t.hint.toLowerCase().includes(q));
              const matchText = matchedKw || (matchedTell && matchedTell.slice(0, 50)) || (matchedHint && matchedHint.label);
              return matchText ? (
                <div style={{ fontSize: 12, color: pat.color, marginTop: 3, opacity: 0.8 }}>
                  matched: {matchText}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#555", marginTop: 3, lineHeight: 1.4 }}>
                  {pat.keywords.slice(0, 3).join(" · ")}
                </div>
              );
            })()}
          </div>
        ))
      ) : (
        // When not searching, show grouped
        patternGroups.map(group => {
          const groupPatterns = patterns.filter(pat => group.patterns.includes(pat.name));
          return (
            <div key={group.label} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 11,
                color: "#444",
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "4px 14px 6px",
                marginBottom: 2,
                borderBottom: "1px solid #1a1a1a",
              }}>
                {group.label}
              </div>
              {groupPatterns.map(pat => (
                <div
                  key={pat.name}
                  onClick={() => selectPattern(pat)}
                  style={{
                    padding: "10px 14px",
                    marginBottom: 2,
                    borderRadius: 6,
                    cursor: "pointer",
                    background: selected?.name === pat.name ? "#1a1a1a" : "transparent",
                    borderLeft: selected?.name === pat.name ? `3px solid ${pat.color}` : "3px solid transparent",
                    transition: "all 0.1s",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 600, color: selected?.name === pat.name ? pat.color : "#ccc" }}>
                    {pat.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 3, lineHeight: 1.4 }}>
                    {pat.keywords.slice(0, 3).join(" · ")}
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      background: "#0d0d0d",
      minHeight: "100vh",
      color: "#e0e0e0",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        html { font-size: 17px; }
        pre, code { font-size: 13px !important; line-height: 1.8; }
        .ui-text-sm { font-size: 13px; }
        .ui-text-md { font-size: 15px; }
        .ui-text-lg { font-size: 18px; }
      `}</style>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e1e1e",
        padding: isMobile ? "16px 16px 14px" : "24px 32px 20px",
        background: "#0d0d0d",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          {!(isMobile && showDetail) && !(isLandscape && window.innerWidth < 1024 && selected) && (
            <span style={{ fontSize: 10, color: "#555", letterSpacing: 3, textTransform: "uppercase" }}>Interview Prep</span>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginTop: isMobile && showDetail ? 0 : 4 }}>
            {/* On mobile in detail view: show back button instead of title */}
            {(isMobile && showDetail) || (isLandscape && window.innerWidth < 1024 && selected) ? (
              <button
                onClick={() => { setShowDetail(false); setSelected(null); }}
                style={{
                  background: "none",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  color: "#aaa",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "7px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ← Back
              </button>
            ) : (
              <h1 style={{ margin: 0, fontSize: isMobile ? 16 : 22, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
                DSA Pattern Recognition
              </h1>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={() => setShowConstraints(v => !v)}
                style={{
                  background: showConstraints ? "#f9ca24" : "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  color: showConstraints ? "#000" : "#888",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "8px 14px",
                  cursor: "pointer",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                ⚡ Constraints
              </button>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setSelected(null); setShowDetail(false); }}
                placeholder="search..."
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  padding: "8px 14px",
                  color: "#e0e0e0",
                  fontFamily: "inherit",
                  fontSize: 15,
                  width: isMobile ? "100%" : 220,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Constraint Checker Panel */}
          {showConstraints && (
            <div style={{
              marginTop: 14,
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              padding: "16px 20px",
              display: "flex",
              gap: isMobile ? 12 : 24,
              flexWrap: "wrap",
            }}>
              {[
                {
                  range: "n ≤ 20",
                  label: "Small",
                  color: "#26de81",
                  patterns: ["Backtracking", "Brute Force", "Recursion"],
                  note: "Exponential OK (2^n, n!)"
                },
                {
                  range: "n ≤ 10^6",
                  label: "Medium",
                  color: "#f9ca24",
                  patterns: ["Two Pointers", "Sliding Window", "Greedy", "Heap", "DP"],
                  note: "Need O(n) or O(n log n)"
                },
                {
                  range: "n ≥ 10^7",
                  label: "Large",
                  color: "#FC5C65",
                  patterns: ["Binary Search", "Math/Formula"],
                  note: "O(log n) or O(1) only"
                },
              ].map(({ range, label, color, patterns, note }) => (
                <div key={range} style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{range}</span>
                    <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{note}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {patterns.map(pat => (
                      <span key={pat} style={{
                        background: `${color}18`,
                        border: `1px solid ${color}33`,
                        color,
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 13,
                        fontWeight: 600,
                      }}>{pat}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      {isMobile ? (
        // Portrait mobile: show list OR detail, not both
        <div style={{ padding: "12px" }}>
          {showDetail && selected ? detailPanel : listPanel}
        </div>
      ) : isLandscape && window.innerWidth < 1024 ? (
        // Landscape mobile/tablet: full screen single panel, toggle between list and detail
        <div style={{ height: "calc(100vh - 80px)", overflowY: "auto", padding: "12px 16px" }}>
          {selected ? detailPanel : listPanel}
        </div>
      ) : (
        // Desktop: side by side always visible
        <div style={{ maxWidth: "100%", margin: "0 auto", padding: "20px 24px", display: "flex", gap: 24, height: "calc(100vh - 100px)" }}>
          <div style={{ width: 300, flexShrink: 0, overflowY: "auto", paddingRight: 8 }}>
            {listPanel}
          </div>
          <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
            {detailPanel}
          </div>
        </div>
      )}
    </div>
  );
}