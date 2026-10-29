import AppKit
import CoreText
import Foundation
import ImageIO

let width = 1920
let height = 1080
let frameRate = 30
let frameCount = 405

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(red: CGFloat((hex >> 16) & 255) / 255,
          green: CGFloat((hex >> 8) & 255) / 255,
          blue: CGFloat(hex & 255) / 255, alpha: alpha)
}

let ink = color(0x141311)
let accent = color(0xff4d2e)
let fills = [0xf6d78c, 0xbcd9df, 0xdac8ed, 0xc5d9b6, 0xf3b7a7].map { color(UInt32($0)) }
let positions: [CGPoint] = [
  CGPoint(x: 275, y: 340), CGPoint(x: 505, y: 290), CGPoint(x: 700, y: 430),
  CGPoint(x: 370, y: 610), CGPoint(x: 800, y: 730), CGPoint(x: 955, y: 335),
  CGPoint(x: 1115, y: 555), CGPoint(x: 1335, y: 360), CGPoint(x: 1540, y: 610),
  CGPoint(x: 1220, y: 800),
]
let neighbors = [
  (0, 1), (0, 3), (1, 2), (2, 3), (2, 4), (2, 5), (3, 4),
  (4, 6), (5, 6), (5, 7), (6, 7), (6, 9), (7, 8), (8, 9),
]

func clamp(_ value: Double) -> CGFloat { CGFloat(max(0, min(1, value))) }
func ease(_ value: Double) -> CGFloat {
  let t = clamp(value)
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2
}

func rounded(_ context: CGContext, _ rect: CGRect, radius: CGFloat, fill: CGColor, stroke: CGColor? = nil, lineWidth: CGFloat = 0) {
  let path = CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil)
  context.addPath(path)
  context.setFillColor(fill)
  context.fillPath()
  if let stroke {
    context.addPath(path)
    context.setStrokeColor(stroke)
    context.setLineWidth(lineWidth)
    context.strokePath()
  }
}

func text(_ context: CGContext, _ value: String, x: CGFloat, y: CGFloat, size: CGFloat, foreground: CGColor) {
  let font = CTFontCreateWithName("Arial-Black" as CFString, size, nil)
  let attributes: [NSAttributedString.Key: Any] = [
    NSAttributedString.Key(kCTFontAttributeName as String): font,
    NSAttributedString.Key(kCTForegroundColorAttributeName as String): foreground,
  ]
  let line = CTLineCreateWithAttributedString(NSAttributedString(string: value, attributes: attributes))
  let lineWidth = CGFloat(CTLineGetTypographicBounds(line, nil, nil, nil))
  context.saveGState()
  context.translateBy(x: x, y: y)
  context.scaleBy(x: 1, y: -1)
  context.textPosition = CGPoint(x: -lineWidth / 2, y: -size * 0.34)
  CTLineDraw(line, context)
  context.restoreGState()
}

func drawCard(_ context: CGContext, index: Int, center: CGPoint, scale: CGFloat) {
  context.saveGState()
  context.translateBy(x: center.x, y: center.y)
  context.scaleBy(x: scale, y: scale)
  rounded(context, CGRect(x: -65, y: -43, width: 144, height: 104), radius: 13, fill: color(0x141311, 0.14))
  rounded(context, CGRect(x: -72, y: -52, width: 144, height: 104), radius: 13, fill: fills[index % fills.count], stroke: ink, lineWidth: 6)
  rounded(context, CGRect(x: -50, y: -31, width: 25, height: 8), radius: 4, fill: accent)
  context.setStrokeColor(color(0x141311, 0.45))
  context.setLineWidth(5)
  context.setLineCap(.round)
  context.move(to: CGPoint(x: -18, y: -24))
  context.addLine(to: CGPoint(x: 42, y: -24))
  context.strokePath()
  context.setStrokeColor(color(0x141311, 0.35))
  context.move(to: CGPoint(x: -38, y: -8))
  context.addLine(to: CGPoint(x: 42, y: -8))
  context.strokePath()
  text(context, String(format: "DOC %02d", index + 1), x: 0, y: 26, size: 26, foreground: ink)
  context.restoreGState()
}

func drawFrame(_ context: CGContext, at seconds: Double) {
  context.saveGState()
  context.translateBy(x: 0, y: CGFloat(height))
  context.scaleBy(x: 1, y: -1)
  context.setFillColor(color(0xf5f5f5))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  text(context, "DOCUMENTS", x: 960, y: 110, size: 78, foreground: ink)
  context.setStrokeColor(accent)
  context.setLineWidth(10)
  context.setLineCap(.round)
  context.move(to: CGPoint(x: 880, y: 172))
  context.addLine(to: CGPoint(x: 1040, y: 172))
  context.strokePath()

  let spread = ease((seconds - 3) / 2.7)
  let paperOpacity = 1 - clamp((seconds - 3) / 0.5)
  if paperOpacity > 0 {
    rounded(context, CGRect(x: 738.5, y: 217, width: 465, height: 740), radius: 24, fill: color(0x141311, 0.12 * paperOpacity))
    rounded(context, CGRect(x: 727.5, y: 205, width: 465, height: 740), radius: 24, fill: color(0xffffff, paperOpacity), stroke: color(0x141311, paperOpacity), lineWidth: 8)
  }

  for (index, edge) in neighbors.enumerated() {
    let progress = ease((seconds - 6.5 - Double(index) * 0.42) / 0.42)
    if progress <= 0 { continue }
    let from = positions[edge.0]
    let to = positions[edge.1]
    let dx = to.x - from.x
    let dy = to.y - from.y
    let inset = min(72 / abs(dx == 0 ? 1 : dx), 52 / abs(dy == 0 ? 1 : dy))
    let start = CGPoint(x: from.x + dx * inset, y: from.y + dy * inset)
    let end = CGPoint(x: to.x - dx * inset, y: to.y - dy * inset)
    context.setStrokeColor(ink)
    context.setLineWidth(8)
    context.setLineCap(.round)
    context.move(to: start)
    context.addLine(to: CGPoint(x: start.x + (end.x - start.x) * progress,
                                y: start.y + (end.y - start.y) * progress))
    context.strokePath()
  }

  for (index, position) in positions.enumerated() {
    let list = CGPoint(x: 960, y: CGFloat(257 + index * 63))
    let center = CGPoint(x: list.x + (position.x - list.x) * spread,
                         y: list.y + (position.y - list.y) * spread)
    drawCard(context, index: index, center: center, scale: 0.55 + 0.45 * spread)
  }
  context.restoreGState()
}

let byteCount = width * height * 4
let pixels = UnsafeMutablePointer<UInt8>.allocate(capacity: byteCount)
defer { pixels.deallocate() }
let bitmapInfo = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue
guard let context = CGContext(data: pixels, width: width, height: height, bitsPerComponent: 8,
                              bytesPerRow: width * 4, space: CGColorSpaceCreateDeviceRGB(),
                              bitmapInfo: bitmapInfo) else {
  fatalError("Could not create drawing context")
}

if CommandLine.arguments.count == 3 && CommandLine.arguments[1] == "--still" {
  drawFrame(context, at: Double(CommandLine.arguments[2]) ?? 0)
  let data = NSMutableData()
  guard let image = context.makeImage(),
        let destination = CGImageDestinationCreateWithData(data, "public.png" as CFString, 1, nil) else {
    fatalError("Could not create PNG")
  }
  CGImageDestinationAddImage(destination, image, nil)
  CGImageDestinationFinalize(destination)
  FileHandle.standardOutput.write(data as Data)
} else {
  for frame in 0..<frameCount {
    drawFrame(context, at: Double(frame) / Double(frameRate))
    FileHandle.standardOutput.write(Data(bytes: pixels, count: byteCount))
  }
}
