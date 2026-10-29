import AppKit
import CoreText
import Foundation
import ImageIO

let width = 1920
let height = 1080
let frameRate = 30
let frameCount = 210
let columns = 14
let rows = 5

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(red: CGFloat((hex >> 16) & 255) / 255,
          green: CGFloat((hex >> 8) & 255) / 255,
          blue: CGFloat(hex & 255) / 255, alpha: alpha)
}

let ink = color(0x141311)
let accent = color(0xff4d2e)
let burntOrange = color(0xbd5b1c)
let fills = [0xf6d78c, 0xbcd9df, 0xdac8ed, 0xc5d9b6, 0xf3b7a7].map { color(UInt32($0)) }
let points: [CGPoint] = (0..<(columns * rows)).map { index in
  let column = index % columns
  let row = index / columns
  return CGPoint(x: 265 + CGFloat(column * 106) + CGFloat(sin(Double(index) * 2.3) * 16),
                 y: 285 + CGFloat(row * 112) + CGFloat(sin(Double(index) * 1.7) * 16))
}
let routeRows = [2, 2, 1, 1, 2, 3, 2, 1, 2, 3, 3, 2, 2]
let route = routeRows.enumerated().map { column, row in row * columns + column }
var links: [(Int, Int)] = []
for row in 0..<rows {
  for column in 0..<columns {
    let index = row * columns + column
    if column < columns - 1 { links.append((index, index + 1)) }
    if row < rows - 1 && (row + column) % 3 == 0 { links.append((index, index + columns)) }
  }
}
for index in 0..<(route.count - 1) {
  let from = route[index]
  let to = route[index + 1]
  if !links.contains(where: { $0.0 == from && $0.1 == to }) { links.append((from, to)) }
}

func clamp(_ value: Double) -> CGFloat { CGFloat(max(0, min(1, value))) }
func ease(_ value: Double) -> CGFloat {
  let t = clamp(value)
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2
}
func easeOut(_ value: Double) -> CGFloat {
  let t = 1 - clamp(value)
  return 1 - t * t * t
}
func easeOutBack(_ value: Double) -> CGFloat {
  let t = clamp(value) - 1
  return 1 + 2.70158 * t * t * t + 1.70158 * t * t
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

func line(_ context: CGContext, from: CGPoint, to: CGPoint, stroke: CGColor, lineWidth: CGFloat, opacity: CGFloat = 1, progress: CGFloat = 1) {
  if progress <= 0 || opacity <= 0 { return }
  context.saveGState()
  context.setAlpha(opacity)
  context.setStrokeColor(stroke)
  context.setLineWidth(lineWidth)
  context.setLineCap(.round)
  context.move(to: from)
  context.addLine(to: CGPoint(x: from.x + (to.x - from.x) * progress,
                              y: from.y + (to.y - from.y) * progress))
  context.strokePath()
  context.restoreGState()
}

func labelCard(_ context: CGContext, value: String, center: CGPoint, size: CGSize, fontSize: CGFloat, opacity: CGFloat, scale: CGFloat) {
  if opacity <= 0 { return }
  context.saveGState()
  context.setAlpha(opacity)
  context.translateBy(x: center.x, y: center.y)
  context.scaleBy(x: scale, y: scale)
  let rect = CGRect(x: -size.width / 2, y: -size.height / 2, width: size.width, height: size.height)
  rounded(context, rect.offsetBy(dx: 7, dy: 8), radius: 22, fill: color(0x141311, 0.13))
  rounded(context, rect, radius: 22, fill: color(0xffffff), stroke: burntOrange, lineWidth: 8)
  text(context, value, x: 0, y: 0, size: fontSize, foreground: ink)
  context.restoreGState()
}

func drawFrame(_ context: CGContext, at seconds: Double) {
  context.saveGState()
  context.translateBy(x: 0, y: CGFloat(height))
  context.scaleBy(x: 1, y: -1)
  context.setFillColor(color(0xf5f5f5))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  text(context, "50,000 DOCUMENTS", x: 960, y: 110, size: 78, foreground: ink)
  line(context, from: CGPoint(x: 880, y: 172), to: CGPoint(x: 1040, y: 172), stroke: accent, lineWidth: 10)

  for edge in links { line(context, from: points[edge.0], to: points[edge.1], stroke: ink, lineWidth: 3, opacity: 0.23) }
  for index in 0..<(route.count - 1) {
    let progress = ease((seconds - 2.1 - Double(index) * 0.24) / 0.44)
    line(context, from: points[route[index]], to: points[route[index + 1]], stroke: burntOrange, lineWidth: 12, progress: progress)
  }
  line(context, from: points[route.last!], to: CGPoint(x: 1515, y: 741), stroke: burntOrange,
       lineWidth: 12, progress: ease((seconds - 5.5) / 0.4))

  for (index, point) in points.enumerated() {
    rounded(context, CGRect(x: point.x - 16, y: point.y - 19, width: 38, height: 46), radius: 6, fill: color(0x141311, 0.12))
    rounded(context, CGRect(x: point.x - 19, y: point.y - 23, width: 38, height: 46), radius: 6,
            fill: fills[index % fills.count], stroke: ink, lineWidth: 3)
    line(context, from: CGPoint(x: point.x - 9, y: point.y - 8), to: CGPoint(x: point.x + 9, y: point.y - 8), stroke: ink, lineWidth: 2, opacity: 0.5)
    line(context, from: CGPoint(x: point.x - 9, y: point.y + 1), to: CGPoint(x: point.x + 5, y: point.y + 1), stroke: ink, lineWidth: 2, opacity: 0.35)
  }

  let questionOpacity = clamp((seconds - 1.1) / 0.3)
  let questionScale = 0.75 + 0.25 * easeOutBack((seconds - 1.1) / 0.45)
  labelCard(context, value: "QUESTION ?", center: CGPoint(x: 260, y: 250),
            size: CGSize(width: 210, height: 82), fontSize: 25,
            opacity: questionOpacity, scale: questionScale)

  let counterOpacity = clamp((seconds - 2.1) / 0.3)
  if counterOpacity > 0 {
    context.saveGState()
    context.setAlpha(counterOpacity)
    let hops = Int(round(900 * easeOut((seconds - 2.1) / 3.4)))
    text(context, "≈\(hops) JUMPS", x: 960, y: 935, size: 70, foreground: burntOrange)
    context.restoreGState()
  }

  let answerOpacity = clamp((seconds - 5.5) / 0.3)
  let answerScale = 0.75 + 0.25 * easeOutBack((seconds - 5.5) / 0.45)
  labelCard(context, value: "ANSWER", center: CGPoint(x: 1515, y: 785),
            size: CGSize(width: 220, height: 88), fontSize: 36,
            opacity: answerOpacity, scale: answerScale)
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
