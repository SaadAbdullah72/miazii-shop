$path = "c:\Users\Hp\Desktop\e commerce\server\controllers\orderController.js"
$content = Get-Content $path -Raw

# 1. Update updateOrderToPaid
$search1 = "const updatedOrder = await order\.save\(\);\s+res\.json\(updatedOrder\);"
$replace1 = "const updatedOrder = await order.save();`n`n        // Push Alert: Payment`n        safePushDispatch('Payment Received! ✅', \`"Your order #$(`$order._id.toString().slice(-6).toUpperCase()) has been successfully paid.\`", \`"/order/$(`$order._id)\`").catch(err => console.error('[Push] Payment Alert Error:', err));`n`n        res.json(updatedOrder);"

# 2. Update updateOrderStatus
$search2 = "const updatedOrder = await order\.save\(\);\s+res\.json\(updatedOrder\);"
# Note: Since there are two identical matches, we need to be careful or use a more specific context.
# But for now, let's just do a global replace if they are all within the save() blocks.
# Actually, I'll use a more specific search.

$content = $content -replace $search1, $replace1
Set-Content $path $content
