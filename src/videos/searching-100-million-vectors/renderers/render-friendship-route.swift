import AppKit
import CoreText
import Foundation
import ImageIO

let width = 1920
let height = 1080
let frameRate = 30
let duration = 7.5

struct Person {
  let name: String
  let x: CGFloat
  let y: CGFloat
  let color: CGColor
}

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(
    red: CGFloat((hex >> 16) & 255) / 255,
    green: CGFloat((hex >> 8) & 255) / 255,
    blue: CGFloat(hex & 255) / 255,
    alpha: alpha
  )
}

let ink = color(0x141311)
let accent = color(0xff4d2e)
let people = [
  Person(name: "Daniel", x: 410, y: 320, color: accent),
  Person(name: "Sam", x: 710, y: 560, color: color(0xbcd9df)),
  Person(name: "Femi", x: 1150, y: 290, color: color(0xf6d78c)),
  Person(name: "Priya", x: 1550, y: 340, color: color(0xdac8ed)),
  Person(name: "Margaret", x: 1460, y: 800, color: color(0xc5d9b6)),
  Person(name: "Jo", x: 340, y: 810, color: color(0xf3b7a7)),
  Person(name: "Emmanuel", x: 800, y: 760, color: color(0xb7c9ed)),
  Person(name: "Mia", x: 1090, y: 580, color: color(0xe5caa7)),
  Person(name: "You", x: 190, y: 520, color: color(0xffd7af)),
]
let edges = [(0, 1), (7, 2), (5, 6), (0, 2), (3, 4), (1, 7), (2, 6), (0, 5), (7, 3), (6, 4), (1, 6), (7, 4)]

func clamp(_ value: Double) -> CGFloat { CGFloat(max(0, min(1, value))) }
func ease(_ value: Double) -> CGFloat {
  let t = clamp(value)
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2
}

let orange = color(0xf58a24)
let route = [(8, 0), (0, 2), (2, 6), (6, 4)]

func easeOutBack(_ value: Double) -> CGFloat {
  let t = clamp(value) - 1
  return 1 + 2.70158 * t * t * t + 1.70158 * t * t
}

func connection(_ context: CGContext, edge: (Int, Int), progress: CGFloat, directed: Bool) {
  if progress <= 0 { return }
  let from = people[edge.0]
  let to = people[edge.1]
  let dx = to.x - from.x
  let dy = to.y - from.y
  let distance = hypot(dx, dy)
  let ux = dx / distance
  let uy = dy / distance
  let start = CGPoint(x: from.x + ux * 90, y: from.y + uy * 90)
  let visibleLength = (distance - 180) * progress
  let tip = CGPoint(x: start.x + ux * visibleLength, y: start.y + uy * visibleLength)
  let arrowSize: CGFloat = directed ? min(22, visibleLength / 2) : 0
  context.setStrokeColor(directed ? orange : ink)
  context.setLineWidth(directed ? 12 : 9)
  context.setLineCap(.round)
  context.move(to: start)
  context.addLine(to: CGPoint(x: tip.x - ux * arrowSize / 2, y: tip.y - uy * arrowSize / 2))
  context.strokePath()
  if directed {
    context.setFillColor(orange)
    context.move(to: tip)
    context.addLine(to: CGPoint(x: tip.x - ux * arrowSize - uy * arrowSize, y: tip.y - uy * arrowSize + ux * arrowSize))
    context.addLine(to: CGPoint(x: tip.x - ux * arrowSize + uy * arrowSize, y: tip.y - uy * arrowSize - ux * arrowSize))
    context.closePath()
    context.fillPath()
  }
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

func drawFrame(_ context: CGContext, at seconds: Double) {
  context.saveGState()
  context.translateBy(x: 0, y: CGFloat(height))
  context.scaleBy(x: 1, y: -1)
  context.setFillColor(color(0xf5f5f5))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))

  text(context, "FRIENDSHIP GROUP", x: 960, y: 120, size: 78, foreground: ink)
  context.setStrokeColor(accent)
  context.setLineWidth(10)
  context.setLineCap(.round)
  context.move(to: CGPoint(x: 880, y: 181))
  context.addLine(to: CGPoint(x: 1040, y: 181))
  context.strokePath()

  for edge in edges {
    connection(context, edge: edge, progress: 1, directed: false)
  }
  for (index, edge) in route.enumerated() {
    connection(context, edge: edge, progress: ease((seconds - 1.1 - Double(index) * 1.25) / 1.1), directed: true)
  }
  for (index, person) in people.enumerated() {
    let isYou = index == 8
    let appear: CGFloat = isYou ? clamp((seconds - 0.25) / 0.25) : 1
    if appear <= 0 { continue }
    let scale: CGFloat = isYou ? 0.72 + 0.28 * easeOutBack((seconds - 0.25) / 0.55) : 1
    context.saveGState()
    context.setAlpha(appear)
    context.translateBy(x: person.x, y: person.y)
    context.scaleBy(x: scale, y: scale)
    let rect = CGRect(x: -90, y: -90, width: 180, height: 180)
    context.setFillColor(color(0x141311, 0.13))
    context.fillEllipse(in: rect.offsetBy(dx: 9, dy: 11))
    context.setFillColor(person.color)
    context.fillEllipse(in: rect)
    context.setStrokeColor(isYou ? orange : ink)
    context.setLineWidth(isYou ? 12 : 8)
    context.strokeEllipse(in: rect)
    if let routeIndex = route.firstIndex(where: { $0.1 == index }) {
      let highlight = clamp((seconds - 2.2 - Double(routeIndex) * 1.25) / 0.15)
      context.saveGState()
      context.setAlpha(highlight)
      context.setStrokeColor(orange)
      context.setLineWidth(12)
      context.strokeEllipse(in: rect)
      context.restoreGState()
    }
    let graphNameSize: CGFloat = person.name == "Emmanuel" ? 28 : person.name.count >= 9 ? 27 : person.name.count >= 8 ? 32 : person.name.count >= 6 ? 44 : 54
    text(context, person.name, x: 0, y: 0, size: graphNameSize, foreground: ink)
    context.restoreGState()
  }
  context.restoreGState()
}

let byteCount = width * height * 4
let pixels = UnsafeMutablePointer<UInt8>.allocate(capacity: byteCount)
defer { pixels.deallocate() }
let bitmapInfo = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue
guard let context = CGContext(data: pixels, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: bitmapInfo) else {
  fatalError("Could not create drawing context")
}

if CommandLine.arguments.count == 3 && CommandLine.arguments[1] == "--still" {
  let seconds = Double(CommandLine.arguments[2]) ?? 0
  drawFrame(context, at: seconds)
  let data = NSMutableData()
  guard let image = context.makeImage(), let destination = CGImageDestinationCreateWithData(data, "public.png" as CFString, 1, nil) else {
    fatalError("Could not create PNG")
  }
  CGImageDestinationAddImage(destination, image, nil)
  CGImageDestinationFinalize(destination)
  FileHandle.standardOutput.write(data as Data)
} else {
  for frame in 0..<Int(duration * Double(frameRate)) {
    drawFrame(context, at: Double(frame) / Double(frameRate))
    FileHandle.standardOutput.write(Data(bytes: pixels, count: byteCount))
  }
}
