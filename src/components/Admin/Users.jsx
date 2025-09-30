"use client";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload, FiUser } from "react-icons/fi";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

export default function Users() {
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forbidden, setForbidden] = useState(false);

  // UI states
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("token");
      if (stored) setToken(stored);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      setForbidden(false);

      try {
        const res = await axios.get(`${BACKEND_API}/users/all`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        setUsers(res.data.data || []);
        setCount(res.data.count ?? (res.data.data ? res.data.data.length : 0));
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (err.response?.status === 403) {
          setForbidden(true);
        } else {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [token]);

  // Filtered & paginated
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages]);

  function formatDate(d) {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }

  function downloadCSV() {
    const headings = [
      "_id", "name", "username", "email", "phone", "website", "gstNumber",
      "verified", "role", "profilePicture", "publicProfile", "plan",
      "subscriptionValidTill", "followersCount", "followingsCount",
      "createdAt", "updatedAt",
    ];

    const rows = users.map((u) => [
      u._id || "", u.name || "", u.username || "", u.email || "", u.phone || "",
      u.website || "", u.gstNumber || "", String(u.verified || false), u.role || "",
      u.profilePicture || "", String(u.publicProfile || false),
      (u.plan && (u.plan.name || u.plan)) || "", u.subscriptionValidTill || "",
      (u.followers && u.followers.length) || (u.followersCount ?? ""),
      (u.followings && u.followings.length) || (u.followingsCount ?? ""),
      u.createdAt || "", u.updatedAt || "",
    ]);

    const csv = [headings, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-28 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <motion.header
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full"
>
  {/* Left: Title and Count */}
  <div className="w-full sm:w-auto">
    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
      <FiUser className="text-red-600" />
      <span>Users</span>
    </h1>
    <p className="text-sm text-gray-500 mt-1">
      Total users:{" "}
      <span className="font-semibold text-gray-900">{count}</span>
    </p>
  </div>

  {/* Right: Search + Export */}
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
    <div className="relative flex-1 w-full sm:w-auto">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email or username"
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm w-full focus:outline-none"
      />
      <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
    </div>

    <button
      onClick={downloadCSV}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow hover:bg-red-700 transition w-full sm:w-auto"
      title="Export CSV"
    >
      <FiDownload /> Export
    </button>
  </div>
</motion.header>

        {/* Main */}
        <main className="mt-6">
          {loading ? (
            <div className="rounded-lg bg-white shadow px-6 py-12 text-center">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : forbidden ? (
            <div className="rounded-lg bg-white shadow px-6 py-12 text-center">
              <p className="text-red-600 font-semibold">Forbidden</p>
              <p className="text-gray-500 mt-2">
                You must be an admin to view this data.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-white shadow px-6 py-12 text-center">
              <p className="text-red-600 font-semibold">Error</p>
              <p className="text-gray-500 mt-2">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-lg bg-white shadow px-6 py-12 text-center">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((u) => (
                  <motion.article
                    key={u._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow p-5 border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          u.profilePicture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            u.name || u.email || "User"
                          )}&background=ef4444&color=fff`
                        }
                        alt={u.name || u.email}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {u.name || "—"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              @{u.username || "—"}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                u.verified
                                  ? "bg-red-50 text-red-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {u.verified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                        </div>

                       <p className="text-sm text-gray-500 mt-3">
  {u.bio 
    ? u.bio.length > 40 
      ? u.bio.slice(0, 40) + "..." 
      : u.bio 
    : "No bio provided"}
</p>


                        <div className="mt-3 text-sm text-gray-600 grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-gray-400">Email</div>
                            <div className="truncate">{u.email || "—"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Phone</div>
                            <div className="truncate">{u.phone || "—"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Website</div>
                            <div className="truncate">
                              <a
                                href={u.website || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-red-600 hover:underline"
                              >
                                {u.website || "—"}
                              </a>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">GST</div>
                            <div className="truncate">{u.gstNumber || "—"}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                          <div>
                            <div className="text-xs text-gray-400">Followers</div>
                            <div className="font-semibold text-gray-900">
                              {(u.followers && u.followers.length) ||
                                u.followersCount ||
                                0}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Followings</div>
                            <div className="font-semibold text-gray-900">
                              {(u.followings && u.followings.length) ||
                                u.followingsCount ||
                                0}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Listings</div>
                            <div className="font-semibold text-gray-900">
                              {u.listingsCreatedThisMonth ?? 0}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 border-t pt-3 text-xs text-gray-500 grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-gray-400">Joined</div>
                            <div className="font-medium text-gray-900">
                              {formatDate(u.createdAt)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Subscription</div>
                            <div className="font-medium text-gray-900">
                              {u.subscriptionValidTill
                                ? formatDate(u.subscriptionValidTill)
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </section>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {(page - 1) * perPage + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(page * perPage, filtered.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {filtered.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border shadow-sm disabled:opacity-50"
                  >
                    <FiChevronLeft /> Prev
                  </button>
                  <div className="text-sm text-gray-700 px-3 py-2">
                    {page} / {pages}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border shadow-sm disabled:opacity-50"
                  >
                    Next <FiChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
