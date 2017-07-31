# import math
# from concurrent.futures import ThreadPoolExecutor, wait, as_completed
# from time import time

# x = []

# for i in range(105):
#     x.append(i)


# pool = ThreadPoolExecutor(len(x))

# def compute(i):
#     return x[i * max_items_per_bucket:(i + 1) * max_items_per_bucket]

# max_items_per_bucket = 10
# limit = int(math.ceil(len(x) / max_items_per_bucket))
# futures = [pool.submit(compute, i) for i in range(limit + 1)]
# print(futures)
# results = [r.result() for r in as_completed(futures)]

# print(results)

x = [1,2,3,4]
for i, v in enumerate(x):
    print(i, v)
    l = "yes" if i % 2 == 0 else "no"
    print(l)

import math
print(max(10, 0))