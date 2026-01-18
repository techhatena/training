import { useEditor } from "@craftjs/core";
import { Input } from "@/components/ui/input";

/**
 * GIẢI THÍCH SETTINGS PANEL:
 * - Đây là panel bên phải để chỉnh sửa properties của element được chọn
 * - useEditor: lấy thông tin element hiện tại được chọn
 * - selected: chứa thông tin element (name, props)
 * - actions.setProp: function để cập nhật properties của element
 */

export default function SettingsPanel() {
  const { selected, actions } = useEditor((state) => {
    // state.events.selected is a Set, convert it to string
    const selectedSet = state.events.selected;
    const id =
      selectedSet instanceof Set ? Array.from(selectedSet)[0] : selectedSet;

    if (!id) {
      return { selected: null, actions: state.actions };
    }

    const node = state.nodes[id];
    if (!node || !node.data) {
      return { selected: null, actions: state.actions };
    }

    return {
      selected: {
        id,
        name: node.data.name,
        props: node.data.props,
      },
      actions: state.actions,
    };
  });

  // Nếu không có element được chọn -> hiển thị message
  if (!selected) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-400">👆 Chọn element</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 max-h-screen overflow-y-auto">
      <h3 className="font-semibold text-sm text-gray-800 sticky top-0 bg-white pb-2">
        ⚙️ Settings
      </h3>

      {/* SETTINGS CHO TEXTFIELD (INPUT) */}
      {selected.name === "TextField" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Label</label>
            <Input
              value={selected.props.label || ""}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.label = e.target.value;
                });
              }}
              placeholder="Nhập label..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">
              Placeholder
            </label>
            <Input
              value={selected.props.placeholder || ""}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.placeholder = e.target.value;
                });
              }}
              placeholder="Nhập placeholder..."
            />
          </div>
        </div>
      )}

      {/* SETTINGS CHO TEXTAREA */}
      {selected.name === "Textarea" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Label</label>
            <Input
              value={selected.props.label || ""}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.label = e.target.value;
                });
              }}
              placeholder="Nhập label..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">
              Placeholder
            </label>
            <Input
              value={selected.props.placeholder || ""}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.placeholder = e.target.value;
                });
              }}
              placeholder="Nhập placeholder..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Số dòng</label>
            <Input
              type="number"
              value={selected.props.rows || 4}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.rows = parseInt(e.target.value);
                });
              }}
              min="2"
              max="10"
            />
          </div>
        </div>
      )}

      {/* SETTINGS CHO BUTTON */}
      {selected.name === "Button" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Text</label>
            <Input
              value={selected.props.text || ""}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.text = e.target.value;
                });
              }}
              placeholder="Nhập text button..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Loại</label>
            <select
              value={selected.props.variant || "primary"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.variant = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="primary">Primary (Xanh)</option>
              <option value="secondary">Secondary (Xám)</option>
              <option value="danger">Danger (Đỏ)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Kích cỡ</label>
            <select
              value={selected.props.size || "md"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.size = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="sm">Nhỏ (Small)</option>
              <option value="md">Vừa (Medium)</option>
              <option value="lg">Lớn (Large)</option>
              <option value="xl">Rất lớn (XL)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Căn lề</label>
            <select
              value={selected.props.alignment || "full"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.alignment = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="left">Trái (Left)</option>
              <option value="center">Giữa (Center)</option>
              <option value="right">Phải (Right)</option>
              <option value="full">Chiếm toàn bộ (Full Width)</option>
            </select>
          </div>
        </div>
      )}

      {/* SETTINGS CHO TITLE */}
      {selected.name === "Title" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Text</label>
            <Input
              value={selected.props.text || ""}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.text = e.target.value;
                });
              }}
              placeholder="Nhập tiêu đề..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Cỡ</label>
            <select
              value={selected.props.size || "h2"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.size = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="h1">H1 (Lớn nhất)</option>
              <option value="h2">H2 (Vừa)</option>
              <option value="h3">H3 (Nhỏ)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Màu nền</label>
            <select
              value={selected.props.bgColor || "white"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.bgColor = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="white">Trắng</option>
              <option value="blue">Xanh nhạt</option>
              <option value="gray">Xám nhạt</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Căn lề</label>
            <select
              value={selected.props.align || "left"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.align = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="left">Trái</option>
              <option value="center">Giữa</option>
              <option value="right">Phải</option>
            </select>
          </div>
        </div>
      )}

      {/* SETTINGS CHO TEXT */}
      {selected.name === "Text" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">
              Nội dung
            </label>
            <textarea
              value={selected.props.content || ""}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.content = e.target.value;
                });
              }}
              placeholder="Nhập text..."
              className="w-full border rounded px-2 py-1 text-sm resize-none"
              rows="3"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Căn lề</label>
            <select
              value={selected.props.align || "left"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.align = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="left">Trái</option>
              <option value="center">Giữa</option>
              <option value="right">Phải</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Màu</label>
            <select
              value={selected.props.color || "gray"}
              onChange={(e) => {
                actions.setProp(selected.id, (props) => {
                  props.color = e.target.value;
                });
              }}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              <option value="gray">Xám</option>
              <option value="dark">Đen</option>
              <option value="light">Nhạt</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
