module.exports = [
"[project]/components/AdminAnnouncementForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminAnnouncementForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AdminAnnouncementForm() {
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        body: "",
        channel: "IN_APP",
        status: "DRAFT"
    });
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    async function submit() {
        const response = await fetch("/api/admin/announcements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });
        const data = await response.json();
        setNotice(response.ok ? "Announcement saved." : data.error || "Unable to save announcement.");
        if (response.ok) setForm({
            title: "",
            body: "",
            channel: "IN_APP",
            status: "DRAFT"
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-base font-semibold text-white",
                children: "Publish announcement"
            }, void 0, false, {
                fileName: "[project]/components/AdminAnnouncementForm.tsx",
                lineNumber: 3,
                columnNumber: 676
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-xs text-slate-400",
                children: "In-app publishing is live. External channels remain connector-ready demo controls."
            }, void 0, false, {
                fileName: "[project]/components/AdminAnnouncementForm.tsx",
                lineNumber: 3,
                columnNumber: 752
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: form.title,
                        onChange: (e)=>setForm({
                                ...form,
                                title: e.target.value
                            }),
                        placeholder: "Announcement title",
                        className: "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-400"
                    }, void 0, false, {
                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                        lineNumber: 3,
                        columnNumber: 913
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: form.body,
                        onChange: (e)=>setForm({
                                ...form,
                                body: e.target.value
                            }),
                        placeholder: "Message",
                        rows: 4,
                        className: "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-400"
                    }, void 0, false, {
                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                        lineNumber: 3,
                        columnNumber: 1166
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form.channel,
                                onChange: (e)=>setForm({
                                        ...form,
                                        channel: e.target.value
                                    }),
                                className: "rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "IN_APP",
                                        children: "In-app"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                        lineNumber: 3,
                                        columnNumber: 1632
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "EMAIL",
                                        children: "Email connector"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                        lineNumber: 3,
                                        columnNumber: 1670
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "SOCIAL",
                                        children: "Social connector"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                        lineNumber: 3,
                                        columnNumber: 1716
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                lineNumber: 3,
                                columnNumber: 1446
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: form.status,
                                onChange: (e)=>setForm({
                                        ...form,
                                        status: e.target.value
                                    }),
                                className: "rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        children: "DRAFT"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                        lineNumber: 3,
                                        columnNumber: 1957
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        children: "PUBLISHED"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                        lineNumber: 3,
                                        columnNumber: 1979
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                lineNumber: 3,
                                columnNumber: 1773
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: submit,
                                className: "ml-auto rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white",
                                children: "Save announcement"
                            }, void 0, false, {
                                fileName: "[project]/components/AdminAnnouncementForm.tsx",
                                lineNumber: 3,
                                columnNumber: 2014
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                        lineNumber: 3,
                        columnNumber: 1418
                    }, this),
                    notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-400",
                        children: notice
                    }, void 0, false, {
                        fileName: "[project]/components/AdminAnnouncementForm.tsx",
                        lineNumber: 3,
                        columnNumber: 2167
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AdminAnnouncementForm.tsx",
                lineNumber: 3,
                columnNumber: 881
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AdminAnnouncementForm.tsx",
        lineNumber: 3,
        columnNumber: 596
    }, this);
}
}),
];

//# sourceMappingURL=components_AdminAnnouncementForm_tsx_1bmo4h0._.js.map