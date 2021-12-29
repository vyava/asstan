import { LoginLayout } from "src/layouts/Login";
import { useRouter } from 'next/router'

const Comment = () => {
  const router = useRouter()
  const { userId, hash } = router.query

  return (
    <LoginLayout title="Şifremi unuttum">
      <h1>User ID: {userId}</h1>
      <h1>HASH: {hash}</h1>
    </LoginLayout>
  )
}

export default Comment