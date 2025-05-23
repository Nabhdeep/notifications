import UserClientPage from './UserClientPage';

export default async function Page({ params }) {
     const { id } = await params
  return <UserClientPage userId={id} />;
}
