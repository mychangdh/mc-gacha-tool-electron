import { Modal, Button } from 'antd';
import { useState } from 'react';

export default function ({ showMessage = true }) {
    const [showFindMc, setShowFindMc] = useState(true)
    return (
        <>
            <Button type="primary">手动选择</Button>
            <Modal
                open={showFindMc}
                title="请手动选择位置"
                onCancel={() => setShowFindMc(false)}
                footer={[]}
            >
                {showMessage ? <p>没有找到安装目录呢，请手动选择一下吧</p> : <></>}

            </Modal>
        </>
    )
}