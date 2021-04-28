export default function ({ store, redirect }) {
  const { auth } = store.state
  const { user } = auth;
  console.log('nonadmin');
  if (
    !user ||
    !user.roles ||
    user.roles.includes('admin')
  ) {
    return redirect('/users')
  }
}
