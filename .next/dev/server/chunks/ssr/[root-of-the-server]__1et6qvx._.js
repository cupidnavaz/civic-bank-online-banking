module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/dashboard/investments/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

async function handleReceiptUploadAndSubmit(file, planId, amount) {
    const formData = new FormData();
    formData.append("receipt", file);
    // 1. Upload the file first
    const uploadRes = await fetch("/api/uploads/receipt", {
        method: "POST",
        body: formData
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.error);
    // 2. Submit the investment record containing the receipt URL
    const investmentRes = await fetch("/api/investments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            planId,
            amount,
            receiptUrl: uploadData.data.url
        })
    });
    return investmentRes.json();
}
}),
"[project]/app/dashboard/investments/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/dashboard/investments/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1et6qvx._.js.map