/**
 * CloudFront/S3용 Next.js 이미지 로더
 * 반응형 이미지 크기와 품질 최적화 지원
 */

module.exports = function cloudFrontLoader({ src, width, quality }) {
  // 이미 최적화된 WebP 이미지들은 그대로 반환
  if (!src.startsWith('/')) {
    return src
  }

  // 반응형 이미지 크기 지원
  const params = new URLSearchParams()
  if (width) {
    params.append('w', width.toString())
  }
  if (quality) {
    params.append('q', quality.toString())
  }

  return params.toString() ? `${src}?${params.toString()}` : src
}
