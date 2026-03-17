



export default function House() {
  return (
    <div
      style={{
        width: 390,
        height: 390,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <img
        src="/House (1).png"
        alt="Casa"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          margin: 'auto',
        }}
      />
    </div>
  );
}
