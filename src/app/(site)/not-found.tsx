import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl font-bold text-primary-200">404</p>
      <h1 className="mt-4 text-3xl font-bold text-ink">Không tìm thấy trang</h1>
      <p className="mt-3 max-w-md text-muted">Trang bạn tìm có thể đã được di chuyển hoặc không còn tồn tại.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Về trang chủ</ButtonLink>
        <ButtonLink href="/dat-lich" variant="secondary">
          Đặt lịch khám
        </ButtonLink>
      </div>
    </Container>
  );
}
