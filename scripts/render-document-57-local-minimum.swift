import AppKit
import CoreText
import Foundation
import ImageIO

let width = 1920
let height = 1080
let frameRate = 30
let frameCount = 345

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(red: CGFloat((hex >> 16) & 255) / 255,
          green: CGFloat((hex >> 8) & 255) / 255,
          blue: CGFloat(hex & 255) / 255, alpha: alpha)
}
func point(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x, y: y) }

let ink = color(0x141311)
let accent = color(0xff4d2e)
let orange = color(0xbd5b1c)
let teal = color(0x0f8c98)
let fills = [0xf6d78c, 0xbcd9df, 0xdac8ed, 0xc5d9b6, 0xf3b7a7].map { color(UInt32($0)) }
let positions: [CGPoint] = [
  point(-650, 180), point(-260, -80), point(120, 40), point(-80, -150),
  point(-120, 200), point(100, -230), point(-760, -140), point(-480, -220),
  point(-430, 220), point(-560, -20), point(-320, -240), point(-20, 260),
]
let doc57 = point(520, -230)
let edges = [
  (0, 1), (0, 6), (0, 8), (0, 9), (1, 2), (1, 3), (1, 7), (1, 9), (1, 10),
  (2, 3), (2, 4), (2, 5), (3, 5), (3, 10), (4, 11), (7, 10), (8, 4), (6, 9),
]

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
func outline(_ context: CGContext, _ rect: CGRect, radius: CGFloat, stroke: CGColor, lineWidth: CGFloat, opacity: CGFloat) {
  if opacity <= 0 { return }
  context.saveGState()
  context.setAlpha(opacity)
  context.addPath(CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil))
  context.setStrokeColor(stroke)
  context.setLineWidth(lineWidth)
  context.strokePath()
  context.restoreGState()
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
func line(_ context: CGContext, from: CGPoint, to: CGPoint, stroke: CGColor, lineWidth: CGFloat, progress: CGFloat = 1, opacity: CGFloat = 1, arrow: Bool = false) {
  if progress <= 0 || opacity <= 0 { return }
  let tip = point(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress)
  context.saveGState()
  context.setAlpha(opacity)
  context.setStrokeColor(stroke)
  context.setLineWidth(lineWidth)
  context.setLineCap(.round)
  context.move(to: from)
  context.addLine(to: tip)
  context.strokePath()
  if arrow {
    let distance = hypot(to.x - from.x, to.y - from.y)
    let ux = (to.x - from.x) / distance
    let uy = (to.y - from.y) / distance
    let size: CGFloat = 23
    context.setFillColor(stroke)
    context.move(to: tip)
    context.addLine(to: point(tip.x - ux * size - uy * size * 0.6, tip.y - uy * size + ux * size * 0.6))
    context.addLine(to: point(tip.x - ux * size + uy * size * 0.6, tip.y - uy * size - ux * size * 0.6))
    context.closePath()
    context.fillPath()
  }
  context.restoreGState()
}
func boundary(_ from: CGPoint, _ to: CGPoint) -> (CGPoint, CGPoint) {
  let dx = to.x - from.x
  let dy = to.y - from.y
  let inset = min(72 / abs(dx == 0 ? 1 : dx), 52 / abs(dy == 0 ? 1 : dy))
  return (point(from.x + dx * inset, from.y + dy * inset),
          point(to.x - dx * inset, to.y - dy * inset))
}
func card(_ context: CGContext, index: Int, seconds: Double) {
  let center = positions[index]
  context.saveGState()
  context.translateBy(x: center.x, y: center.y)
  rounded(context, CGRect(x: -65, y: -43, width: 144, height: 104), radius: 13, fill: color(0x141311, 0.14))
  rounded(context, CGRect(x: -72, y: -52, width: 144, height: 104), radius: 13,
          fill: fills[index % fills.count], stroke: ink, lineWidth: 6)
  if index == 5 {
    outline(context, CGRect(x: -80, y: -60, width: 160, height: 120), radius: 18,
            stroke: teal, lineWidth: 12, opacity: clamp((seconds - 4.5) / 0.5))
  }
  if index == 2 {
    outline(context, CGRect(x: -80, y: -60, width: 160, height: 120), radius: 18,
            stroke: orange, lineWidth: 12, opacity: 1 - 0.5 * clamp((seconds - 8.5) / 0.4))
  }
  rounded(context, CGRect(x: -50, y: -31, width: 25, height: 8), radius: 4, fill: accent)
  line(context, from: point(-18, -24), to: point(42, -24), stroke: ink, lineWidth: 5, opacity: 0.45)
  line(context, from: point(-38, -8), to: point(42, -8), stroke: ink, lineWidth: 5, opacity: 0.35)
  text(context, index < 3 ? ["DOC 02", "DOC 27", "DOC 43"][index] : "DOC",
       x: 0, y: 26, size: index < 3 ? 26 : 29, foreground: ink)
  context.restoreGState()
}

func badge(_ context: CGContext, label: String, x: CGFloat, y: CGFloat,
           width: CGFloat, opacity: CGFloat, stroke: CGColor, size: CGFloat = 22) {
  if opacity <= 0 { return }
  context.saveGState()
  context.setAlpha(opacity)
  rounded(context, CGRect(x: x - width / 2, y: y - 23, width: width, height: 46),
          radius: 13, fill: color(0xffffff), stroke: stroke, lineWidth: 5)
  text(context, label, x: x, y: y, size: size, foreground: ink)
  context.restoreGState()
}

func drawFrame(_ context: CGContext, at seconds: Double) {
  context.saveGState()
  context.translateBy(x: 0, y: CGFloat(height))
  context.scaleBy(x: 1, y: -1)
  context.setFillColor(color(0xf5f5f5))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  text(context, "STUCK AT DOC 43", x: 960, y: 110, size: 78, foreground: ink)
  line(context, from: point(880, 172), to: point(1040, 172), stroke: accent, lineWidth: 10)

  context.saveGState()
  context.translateBy(x: 960, y: 595)
  rounded(context, CGRect(x: -848, y: -356, width: 1720, height: 740),
          radius: 36, fill: color(0x141311, 0.12))
  rounded(context, CGRect(x: -860, y: -370, width: 1720, height: 740),
          radius: 36, fill: color(0xffffff), stroke: ink, lineWidth: 8)
  for edge in edges {
    let segment = boundary(positions[edge.0], positions[edge.1])
    line(context, from: segment.0, to: segment.1, stroke: ink, lineWidth: 7)
  }
  let priorA = boundary(positions[0], positions[1])
  let priorB = boundary(positions[1], positions[2])
  line(context, from: priorA.0, to: priorA.1, stroke: orange, lineWidth: 13, arrow: true)
  line(context, from: priorB.0, to: priorB.1, stroke: orange, lineWidth: 13, arrow: true)
  let priorConnection = boundary(positions[2], point(650, 0))
  line(context, from: priorConnection.0, to: priorConnection.1, stroke: orange, lineWidth: 13)
  let detourA = boundary(positions[2], positions[5])
  let detourB = boundary(positions[5], doc57)
  line(context, from: detourB.0, to: detourB.1, stroke: ink, lineWidth: 7,
       opacity: clamp((seconds - 2) / 0.45))
  line(context, from: detourA.0, to: detourA.1, stroke: teal, lineWidth: 13,
       progress: ease((seconds - 4.5) / 0.8), arrow: seconds >= 4.5)
  line(context, from: detourB.0, to: detourB.1, stroke: teal, lineWidth: 13,
       progress: ease((seconds - 6.5) / 1), arrow: seconds >= 6.5)
  let betterConnection = boundary(doc57, point(650, 0))
  line(context, from: betterConnection.0, to: betterConnection.1, stroke: teal,
       lineWidth: 13, progress: ease((seconds - 8.5) / 0.8))
  for index in positions.indices { card(context, index: index, seconds: seconds) }

  let missedOpacity = clamp((seconds - 2) / 0.35)
  if missedOpacity > 0 {
    context.saveGState()
    context.setAlpha(missedOpacity)
    context.translateBy(x: doc57.x, y: doc57.y)
    let scale = 0.7 + 0.3 * easeOutBack((seconds - 2) / 0.6)
    context.scaleBy(x: scale, y: scale)
    rounded(context, CGRect(x: -65, y: -43, width: 144, height: 104),
            radius: 13, fill: color(0x141311, 0.14))
    rounded(context, CGRect(x: -72, y: -52, width: 144, height: 104),
            radius: 13, fill: color(0xf6d78c), stroke: ink, lineWidth: 6)
    outline(context, CGRect(x: -80, y: -60, width: 160, height: 120),
            radius: 18, stroke: teal, lineWidth: 12, opacity: 1)
    rounded(context, CGRect(x: -50, y: -31, width: 25, height: 8), radius: 4, fill: accent)
    line(context, from: point(-18, -24), to: point(42, -24), stroke: ink, lineWidth: 5, opacity: 0.45)
    line(context, from: point(-38, -8), to: point(42, -8), stroke: ink, lineWidth: 5, opacity: 0.35)
    text(context, "DOC 57", x: 0, y: 26, size: 26, foreground: ink)
    context.restoreGState()
  }

  context.saveGState()
  context.translateBy(x: 650, y: 0)
  rounded(context, CGRect(x: -77, y: -55, width: 170, height: 130),
          radius: 20, fill: color(0x141311, 0.14))
  rounded(context, CGRect(x: -85, y: -65, width: 170, height: 130),
          radius: 20, fill: color(0xffffff), stroke: orange, lineWidth: 9)
  rounded(context, CGRect(x: -33, y: -53, width: 66, height: 26),
          radius: 7, fill: orange)
  text(context, "NEW", x: 0, y: -40, size: 17, foreground: color(0xffffff))
  text(context, "DOC 101", x: 0, y: 16, size: 31, foreground: ink)
  context.restoreGState()

  badge(context, label: "FARTHER FIRST", x: 100, y: -325, width: 260,
        opacity: clamp((seconds - 4.5) / 0.45), stroke: teal)
  badge(context, label: "CLOSER MATCH", x: 560, y: -325, width: 265,
        opacity: clamp((seconds - 2) / 0.4), stroke: teal)
  let localOpacity = clamp((seconds - 8.5) / 0.35)
  if localOpacity > 0 {
    context.saveGState()
    context.setAlpha(localOpacity)
    context.translateBy(x: 420, y: 315)
    let scale = 0.85 + 0.15 * easeOutBack((seconds - 8.5) / 0.55)
    context.scaleBy(x: scale, y: scale)
    rounded(context, CGRect(x: -271, y: -34, width: 560, height: 88),
            radius: 24, fill: color(0x141311, 0.13))
    rounded(context, CGRect(x: -280, y: -44, width: 560, height: 88),
            radius: 24, fill: color(0xffffff), stroke: orange, lineWidth: 8)
    text(context, "LOCAL MINIMUM", x: 0, y: 0, size: 42, foreground: ink)
    context.restoreGState()
  }
  context.restoreGState()
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
