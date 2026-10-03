import { requireAdmin, type Profile } from "@/lib/access";
import { approveUser, revokeUser, blockUser, restoreUser } from "./actions";
import { signOut } from "@/app/auth-actions";

function formatDate(value: string | null) {
  if (!value) return "Permanent";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}


function accessDurationValue(value: string | null) {
  if (!value) return "permanent";

  const remainingDays = Math.max(
    0,
    (new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (remainingDays <= 45) return "30d";
  if (remainingDays <= 140) return "90d";
  return "1y";
}

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { supabase, profile: adminProfile } = await requireAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const users = (data || []) as Profile[];

  return (
    <main className="admin-screen">
      <section className="admin-top">
        <div>
          <div className="auth-kicker">META ADS ADMIN</div>
          <h1>User Access</h1>
          <p>
            Logged in as <strong>{adminProfile.email}</strong>
          </p>
        </div>
        <div className="admin-top-actions">
          <a className="secondary-btn" href="/manual">Open Manual</a>
          <form action={signOut}>
            <button className="secondary-btn" type="submit">Sign out</button>
          </form>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-summary">
          <div><strong>{users.length}</strong><span>Total users</span></div>
          <div><strong>{users.filter(u => u.access_status === "pending").length}</strong><span>Pending</span></div>
          <div><strong>{users.filter(u => u.access_status === "approved").length}</strong><span>Approved</span></div>
          <div><strong>{users.filter(u => u.access_status === "revoked").length}</strong><span>Revoked</span></div>
          <div><strong>{users.filter(u => u.access_status === "blocked").length}</strong><span>Blocked</span></div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Access expiry</th>
                <th>Approve / update access</th>
                <th>Other actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name || "No name"}</strong>
                    <span>{user.email || user.id}</span>
                    {user.role === "admin" ? <em>ADMIN</em> : null}
                  </td>
                  <td>
                    <span className={`status-pill status-${user.access_status}`}>
                      {user.access_status}
                    </span>
                  </td>
                  <td>{user.access_status === "approved" ? formatDate(user.access_expires_at) : "—"}</td>
                  <td>
                    {user.role === "admin" ? (
                      <span className="muted-text">Admin always allowed</span>
                    ) : (
                      <form className="inline-access-form" action={approveUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <select name="duration" defaultValue={accessDurationValue(user.access_expires_at)}>
                          <option value="30d">30 days</option>
                          <option value="90d">90 days</option>
                          <option value="1y">1 year</option>
                          <option value="permanent">Permanent</option>
                        </select>
                        <button className="mini-btn approve-btn" type="submit">
                          {user.access_status === "approved" ? "Update" : "Approve"}
                        </button>
                      </form>
                    )}
                  </td>
                  <td>
                    {user.role === "admin" ? (
                      <span className="muted-text">Protected</span>
                    ) : (
                      <div className="action-buttons">
                        {user.access_status === "revoked" || user.access_status === "blocked" ? (
                          <form action={restoreUser}>
                            <input type="hidden" name="userId" value={user.id} />
                            <button className="mini-btn restore-btn" type="submit">Restore</button>
                          </form>
                        ) : null}
                        <form action={revokeUser}>
                          <input type="hidden" name="userId" value={user.id} />
                          <button className="mini-btn revoke-btn" type="submit">Revoke</button>
                        </form>
                        <form action={blockUser}>
                          <input type="hidden" name="userId" value={user.id} />
                          <button className="mini-btn block-btn" type="submit">Block</button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
