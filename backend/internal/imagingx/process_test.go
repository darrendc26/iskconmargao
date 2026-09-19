package imagingx

import (
	"bytes"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"image/png"
	"testing"
)

func createTestJPEG(w, h int) []byte {
	img := image.NewRGBA(image.Rect(0, 0, w, h))
	blue := color.RGBA{R: 50, G: 100, B: 200, A: 255}
	draw.Draw(img, img.Bounds(), &image.Uniform{C: blue}, image.Point{}, draw.Src)
	var buf bytes.Buffer
	_ = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 90})
	return buf.Bytes()
}

func createTestPNG(w, h int) []byte {
	img := image.NewNRGBA(image.Rect(0, 0, w, h))
	red := color.NRGBA{R: 200, G: 50, B: 50, A: 180}
	draw.Draw(img, img.Bounds(), &image.Uniform{C: red}, image.Point{}, draw.Src)
	var buf bytes.Buffer
	_ = png.Encode(&buf, img)
	return buf.Bytes()
}

func TestProcess_LargeImage(t *testing.T) {
	raw := createTestJPEG(2500, 1500)
	res, err := Process(bytes.NewReader(raw), "image/jpeg")
	if err != nil {
		t.Fatalf("Process failed: %v", err)
	}

	if res.Width != 2500 || res.Height != 1500 {
		t.Errorf("Expected dimensions 2500x1500, got %dx%d", res.Width, res.Height)
	}
	if res.OriginalKeySuffix != "original.webp" {
		t.Errorf("Expected original suffix original.webp, got %s", res.OriginalKeySuffix)
	}
	if res.ThumbKeySuffix != "thumb.webp" {
		t.Errorf("Expected thumb suffix thumb.webp, got %s", res.ThumbKeySuffix)
	}

	if len(res.OriginalBytes) == 0 || len(res.ThumbBytes) == 0 {
		t.Errorf("Expected variant byte slices to be non-empty")
	}

	// Verify decoded dimensions of variants
	origImg, _, err := decode(res.OriginalBytes)
	if err != nil || origImg.Bounds().Dx() != 1600 {
		t.Errorf("Expected original.webp width 1600, got %v (err: %v)", origImg.Bounds().Dx(), err)
	}
	thumbImg, _, err := decode(res.ThumbBytes)
	if err != nil || thumbImg.Bounds().Dx() != 400 {
		t.Errorf("Expected thumb.webp width 400, got %v (err: %v)", thumbImg.Bounds().Dx(), err)
	}
}

func TestProcess_SmallImage(t *testing.T) {
	raw := createTestPNG(350, 200)
	res, err := Process(bytes.NewReader(raw), "image/png")
	if err != nil {
		t.Fatalf("Process failed: %v", err)
	}

	if res.Width != 350 || res.Height != 200 {
		t.Errorf("Expected dimensions 350x200, got %dx%d", res.Width, res.Height)
	}
	if res.OriginalKeySuffix != "original.webp" {
		t.Errorf("Expected original.webp, got %s", res.OriginalKeySuffix)
	}
	if res.ThumbKeySuffix != "original.webp" {
		t.Errorf("Expected thumb to reuse original.webp when width <= 400, got %s", res.ThumbKeySuffix)
	}
	if res.ThumbBytes != nil {
		t.Errorf("Expected ThumbBytes to be nil when reusing original")
	}
}

func TestProcess_MediumImage(t *testing.T) {
	raw := createTestJPEG(800, 600)
	res, err := Process(bytes.NewReader(raw), "image/jpeg")
	if err != nil {
		t.Fatalf("Process failed: %v", err)
	}

	if res.OriginalKeySuffix != "original.webp" {
		t.Errorf("Expected original.webp, got %s", res.OriginalKeySuffix)
	}
	if res.ThumbKeySuffix != "thumb.webp" {
		t.Errorf("Expected thumb.webp when width > 400, got %s", res.ThumbKeySuffix)
	}
	if res.ThumbBytes == nil {
		t.Errorf("Expected ThumbBytes to be non-nil when width > 400")
	}
}
