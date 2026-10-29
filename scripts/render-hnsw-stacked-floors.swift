import AppKit
import CoreText
import Foundation
import ImageIO

let width = 1920
let height = 1080
let frameRate = 30
let frameCount = 630

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(red: CGFloat((hex >> 16) & 255) / 255,
          green: CGFloat((hex >> 8) & 255) / 255,
          blue: CGFloat(hex & 255) / 255, alpha: alpha)
}
func point(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x, y: y) }
func clamp(_ value: Double) -> CGFloat { CGFloat(max(0, min(1, value))) }
func ease(_ value: Double) -> CGFloat {
  let t = clamp(value)
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2
}
func easeOutBack(_ value: Double) -> CGFloat {
  let t = clamp(value) - 1
  return 1 + 2.70158 * t * t * t + 1.70158 * t * t
}

let ink = color(0x141311)
let muted = color(0xb7b1a6)
let accent = color(0xff4d2e)
let orange = color(0xbd5b1c)
let teal = color(0x0f8c98)
let fills = [0xf6d78c, 0xbcd9df, 0xdac8ed, 0xc5d9b6, 0xf3b7a7].map { color(UInt32($0)) }
let maxHeights = [0, 1, 0, 2, 1, 0, 1, 0, 2, 0, 1, 0]
let offsets: [CGFloat] = [-35, 21, -40, 25, -33, 19, -37, 27, -42, 22, -36, 26]
func x(_ index: Int) -> CGFloat { CGFloat(-650 + (index / 2) * 260) }
func docs(_ level: Int) -> [Int] { maxHeights.indices.filter { maxHeights[$0] >= level } }

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
func text(_ context: CGContext, _ value: String, x: CGFloat, y: CGFloat, size: CGFloat, foreground: CGColor, opacity: CGFloat = 1) {
  if opacity <= 0 { return }
  let font = CTFontCreateWithName("Arial-Black" as CFString, size, nil)
  let attributes: [NSAttributedString.Key: Any] = [
    NSAttributedString.Key(kCTFontAttributeName as String): font,
    NSAttributedString.Key(kCTForegroundColorAttributeName as String): foreground,
  ]
  let line = CTLineCreateWithAttributedString(NSAttributedString(string: value, attributes: attributes))
  let lineWidth = CGFloat(CTLineGetTypographicBounds(line, nil, nil, nil))
  context.saveGState()
  context.setAlpha(opacity)
  context.translateBy(x: x, y: y)
  context.scaleBy(x: 1, y: -1)
  context.textPosition = CGPoint(x: -lineWidth / 2, y: -size * 0.34)
  CTLineDraw(line, context)
  context.restoreGState()
}
func line(_ context: CGContext, from: CGPoint, to: CGPoint, stroke: CGColor, width: CGFloat, dashed: Bool = false) {
  context.saveGState()
  context.setStrokeColor(stroke)
  context.setLineWidth(width)
  context.setLineCap(.round)
  if dashed { context.setLineDash(phase: 0, lengths: [12, 9]) }
  context.move(to: from)
  context.addLine(to: to)
  context.strokePath()
  context.restoreGState()
}
func circle(_ context: CGContext, x: CGFloat, y: CGFloat, radius: CGFloat, fill: CGColor, stroke: CGColor? = nil, lineWidth: CGFloat = 0) {
  let rect = CGRect(x: x - radius, y: y - radius, width: radius * 2, height: radius * 2)
  context.setFillColor(fill)
  context.fillEllipse(in: rect)
  if let stroke {
    context.setStrokeColor(stroke)
    context.setLineWidth(lineWidth)
    context.strokeEllipse(in: rect)
  }
}

func floorPanel(_ context: CGContext, level: Int, y: CGFloat, opacity: CGFloat, scale: CGFloat, labelOpacity: CGFloat) {
  if opacity <= 0 { return }
  context.saveGState()
  context.setAlpha(opacity)
  context.translateBy(x: 0, y: y)
  context.scaleBy(x: scale, y: scale)
  rounded(context, CGRect(x: -811, y: -80, width: 1640, height: 180), radius: 30, fill: color(0x141311, 0.12))
  let panel = level == 0 ? color(0xffffff) : level == 1 ? color(0xf5fbfb) : color(0xfffaf1)
  rounded(context, CGRect(x: -820, y: -90, width: 1640, height: 180), radius: 30, fill: panel, stroke: ink, lineWidth: 7)

  let indices = docs(level)
  for pair in zip(indices, indices.dropFirst()) {
    let from = pair.0
    let to = pair.1
    line(context, from: point(x(from), 20 + offsets[from]), to: point(x(to), 20 + offsets[to]),
         stroke: level == 0 ? muted : teal, width: level == 0 ? 5 : 7)
  }
  if level == 0 {
    for (from, to) in [(0, 2), (2, 5), (4, 7), (7, 10)] {
      line(context, from: point(x(from), 20 + offsets[from]), to: point(x(to), 20 + offsets[to]), stroke: muted, width: 5)
    }
  }
  for index in indices {
    let cy = 20 + offsets[index]
    circle(context, x: x(index) + 5, y: cy + 6, radius: 35, fill: color(0x141311, 0.15))
    circle(context, x: x(index), y: cy, radius: 35, fill: fills[index % fills.count], stroke: ink, lineWidth: 5)
  }
  context.restoreGState()
}

func drawFrame(_ context: CGContext, at seconds: Double) {
  context.saveGState()
  context.translateBy(x: 0, y: CGFloat(height))
  context.scaleBy(x: 1, y: -1)
  context.setFillColor(color(0xf5f5f5))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.translateBy(x: 960, y: 540)

  let middleAlpha = clamp((seconds - 14) / 0.7)
  let topAlpha = clamp((seconds - 17) / 0.7)
  context.saveGState()
  context.setAlpha(middleAlpha)
  for index in docs(1) {
    line(context, from: point(x(index), 50), to: point(x(index), 180), stroke: orange, width: 5, dashed: true)
  }
  context.restoreGState()
  context.saveGState()
  context.setAlpha(topAlpha)
  for index in docs(2) {
    line(context, from: point(x(index), -210), to: point(x(index), -80), stroke: orange, width: 5, dashed: true)
  }
  context.restoreGState()

  floorPanel(context, level: 2, y: -270, opacity: topAlpha,
             scale: 0.96 + 0.04 * easeOutBack((seconds - 17) / 0.7), labelOpacity: 1)
  floorPanel(context, level: 1, y: -10, opacity: middleAlpha,
             scale: 0.96 + 0.04 * easeOutBack((seconds - 14) / 0.7), labelOpacity: 1)
  floorPanel(context, level: 0, y: -10 + 260 * ease((seconds - 8) / 1),
             opacity: clamp(seconds / 0.55), scale: 1, labelOpacity: clamp((seconds - 8) / 0.5))
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
