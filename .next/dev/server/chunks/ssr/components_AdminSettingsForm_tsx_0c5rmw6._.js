module.exports = [
"[project]/components/AdminSettingsForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminSettingsForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AdminSettingsForm({ initialValues }) {
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        maintenanceMode: initialValues.maintenanceMode || "false",
        supportEmail: initialValues.supportEmail || "support@civicbank.local",
        defaultCurrency: initialValues.defaultCurrency || "USD"
    });
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    async function save() {
        const response = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        });
        setNotice(response.ok ? "Settings saved." : "Unable to save settings.");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-xs text-slate-400",
                children: [
                    "Maintenance mode",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: values.maintenanceMode,
                        onChange: (e)=>setValues({
                                ...values,
                                maintenanceMode: e.target.value
                            }),
                        className: "mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "false",
                                children: "Disabled"
                            }, void 0, false, {
                                fileName: "[project]/components/AdminSettingsForm.tsx",
                                lineNumber: 3,
                                columnNumber: 1007
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "true",
                                children: "Enabled"
                            }, void 0, false, {
                                fileName: "[project]/components/AdminSettingsForm.tsx",
                                lineNumber: 3,
                                columnNumber: 1046
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AdminSettingsForm.tsx",
                        lineNumber: 3,
                        columnNumber: 789
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AdminSettingsForm.tsx",
                lineNumber: 3,
                columnNumber: 725
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-xs text-slate-400",
                children: [
                    "Support email",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: values.supportEmail,
                        onChange: (e)=>setValues({
                                ...values,
                                supportEmail: e.target.value
                            }),
                        className: "mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
                    }, void 0, false, {
                        fileName: "[project]/components/AdminSettingsForm.tsx",
                        lineNumber: 3,
                        columnNumber: 1161
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AdminSettingsForm.tsx",
                lineNumber: 3,
                columnNumber: 1100
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-xs text-slate-400",
                children: [
                    "Default currency",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: values.defaultCurrency,
                        onChange: (e)=>setValues({
                                ...values,
                                defaultCurrency: e.target.value.toUpperCase()
                            }),
                        className: "mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white"
                    }, void 0, false, {
                        fileName: "[project]/components/AdminSettingsForm.tsx",
                        lineNumber: 3,
                        columnNumber: 1446
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AdminSettingsForm.tsx",
                lineNumber: 3,
                columnNumber: 1382
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: save,
                className: "rounded-xl bg-red-500 px-5 py-3 text-xs font-semibold text-white",
                children: "Save settings"
            }, void 0, false, {
                fileName: "[project]/components/AdminSettingsForm.tsx",
                lineNumber: 3,
                columnNumber: 1687
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-slate-400",
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/AdminSettingsForm.tsx",
                lineNumber: 3,
                columnNumber: 1820
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AdminSettingsForm.tsx",
        lineNumber: 3,
        columnNumber: 635
    }, this);
}
}),
];

//# sourceMappingURL=components_AdminSettingsForm_tsx_0c5rmw6._.js.map