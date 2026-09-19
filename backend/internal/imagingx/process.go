package imagingx

import (
	"bytes"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"strings"

	"github.com/chai2010/webp"
	"github.com/disintegration/imaging"
	golangwebp "golang.org/x/image/webp"
)

const (
	MaxUploadBytes    = 15 << 20 // 15 MB
	MaxDimensionLimit = 10000    // prevent decompressed memory bombs
)

type ProcessedResult struct {
	OriginalKeySuffix string
	ThumbKeySuffix    string
	OriginalBytes     []byte
	ThumbBytes        []byte // nil if thumb matches original (source width <= 400)
	Width             int
	Height            int
	MIME              string
}

// Legacy structure preserved for compatibility if needed elsewhere
type Variants struct {
	Original []byte
	Large    []byte
	Medium   []byte
	Thumb    []byte
	WebP     []byte
	Width    int
	Height   int
	MIME     string
}

func Process(r io.Reader, contentType string) (*ProcessedResult, error) {
	limited := io.LimitReader(r, MaxUploadBytes+1)
	raw, err := io.ReadAll(limited)
	if err != nil {
		return nil, err
	}
	if len(raw) > MaxUploadBytes {
		return nil, fmt.Errorf("file too large (max 15MB)")
	}
	ct := strings.ToLower(contentType)
	if !strings.HasPrefix(ct, "image/") && !looksLikeImage(raw) {
		return nil, fmt.Errorf("unsupported file type")
	}
	img, _, err := decode(raw)
	if err != nil {
		return nil, fmt.Errorf("could not decode image: %w", err)
	}

	b := img.Bounds()
	w, h := b.Dx(), b.Dy()
	if w <= 0 || h <= 0 || w > MaxDimensionLimit || h > MaxDimensionLimit {
		return nil, fmt.Errorf("invalid image dimensions: %dx%d", w, h)
	}

	// Re-encode into clean canvas (strips EXIF / extra metadata)
	cleanImg := imaging.Clone(img)

	// Target bounds:
	// original.webp: max 1600px wide
	// thumb.webp:    max 400px wide

	var origImg image.Image
	if w > 1600 {
		origImg = imaging.Resize(cleanImg, 1600, 0, imaging.Lanczos)
	} else {
		origImg = cleanImg
	}

	origBytes, err := encodeWebP(origImg, 83)
	if err != nil {
		return nil, fmt.Errorf("failed to encode original webp: %w", err)
	}

	res := &ProcessedResult{
		OriginalKeySuffix: "original.webp",
		OriginalBytes:     origBytes,
		Width:             w,
		Height:            h,
		MIME:              "image/webp",
	}

	// Thumb variant: max 400px wide
	if w > 400 {
		thumbImg := imaging.Resize(cleanImg, 400, 0, imaging.Lanczos)
		thumbBytes, err := encodeWebP(thumbImg, 75)
		if err != nil {
			return nil, fmt.Errorf("failed to encode thumb webp: %w", err)
		}
		res.ThumbKeySuffix = "thumb.webp"
		res.ThumbBytes = thumbBytes
	} else {
		// Do not duplicate bytes; thumb reuses original.webp if <= 400px
		res.ThumbKeySuffix = "original.webp"
		res.ThumbBytes = nil
	}

	return res, nil
}

func decode(raw []byte) (image.Image, string, error) {
	img, format, err := image.Decode(bytes.NewReader(raw))
	if err == nil {
		mime := "image/jpeg"
		if format == "png" {
			mime = "image/png"
		} else if format == "gif" {
			mime = "image/gif"
		}
		return img, mime, nil
	}
	if w, err2 := golangwebp.Decode(bytes.NewReader(raw)); err2 == nil {
		return w, "image/webp", nil
	}
	return nil, "", err
}

func encodeWebP(img image.Image, quality float32) ([]byte, error) {
	var buf bytes.Buffer
	options := &webp.Options{
		Lossless: false,
		Quality:  quality,
	}
	if err := webp.Encode(&buf, img, options); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func looksLikeImage(b []byte) bool {
	if len(b) < 12 {
		return false
	}
	return bytes.HasPrefix(b, []byte("\xff\xd8\xff")) ||
		bytes.HasPrefix(b, []byte("\x89PNG")) ||
		bytes.HasPrefix(b, []byte("RIFF")) ||
		bytes.HasPrefix(b, []byte("GIF8"))
}

