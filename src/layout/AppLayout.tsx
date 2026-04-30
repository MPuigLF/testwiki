import Sidebar from '../components/sidebar/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  )
}

const styles: any = {
  wrapper: {
    display: 'flex',
    height: '100vh',
  },
  main: {
    flex: 1,
    padding: 24,
    color: 'white',
    overflow: 'auto',
    backdropFilter: 'blur(10px)',
    background: 'rgba(15, 23, 42, 0.75)',
  }
}