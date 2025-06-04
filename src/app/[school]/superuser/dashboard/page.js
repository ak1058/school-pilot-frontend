import SuperuserDashboard from './SuperuserDasboard';
export const metadata = {
  title: 'Superuser Dashboard',
};
export default function Page({ params }) {
  return (
    <div>
      <SuperuserDashboard params={params}/>
    </div>
  );
}