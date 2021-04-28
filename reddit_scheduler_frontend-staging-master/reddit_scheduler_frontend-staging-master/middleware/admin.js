export default function ({ store, redirect }) {
  const { auth } = store.state
  const { user } = auth;
  if (
    !user ||
    !user.roles ||
    !user.roles.includes('admin')
  ) {
    return redirect('/not-found')
  }
}
